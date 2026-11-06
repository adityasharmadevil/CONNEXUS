// Framework-agnostic WebRTC client. Works with the Spring signaling server at /ws/signaling.
//
// Flow:  caller call-request -> callee call-accept -> caller offer -> callee answer -> both ice-candidate
// States: idle | calling | ringing | connecting | in-call

// Add a TURN server for production; STUN alone fails behind some NATs/firewalls:
// { urls: "turn:turn.example.com:3478", username: "...", credential: "..." }
const DEFAULT_ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];
const RING_TIMEOUT_MS = 30_000;
const DISCONNECT_GRACE_MS = 8_000;

export class CallClient {
  /**
   * @param {object} opts
   * @param {string} opts.wsUrl   e.g. "ws://localhost:8080/ws/signaling"
   * @param {string} opts.token   JWT access token from /login
   * @param {RTCIceServer[]} [opts.iceServers]
   * Callbacks (all optional): onStateChange(state), onIncomingCall({from, callType}),
   * onLocalStream(stream), onRemoteStream(stream), onCallEnded(reason), onError(error), onDisconnected()
   */
  constructor(opts) {
    this.opts = opts;
    this.iceServers = opts.iceServers ?? DEFAULT_ICE_SERVERS;
    this.state = "idle";
    this.ws = null;
    this.pc = null;
    this.localStream = null;
    this.peer = null;
    this.callType = "video";
    this.pendingCandidates = [];
    this.ringTimer = null;
    this.disconnectTimer = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      const url = `${this.opts.wsUrl}?token=${encodeURIComponent(this.opts.token)}`;
      this.ws = new WebSocket(url);
      this.ws.onopen = () => resolve();
      this.ws.onerror = () => reject(new Error("Could not connect to signaling server"));
      this.ws.onmessage = (event) => {
        let msg;
        try {
          msg = JSON.parse(event.data);
        } catch {
          return;
        }
        this.#handleMessage(msg).catch((err) => this.#fail(err));
      };
      this.ws.onclose = () => {
        this.#endCall("signaling-closed");
        this.opts.onDisconnected?.();
      };
    });
  }

  disconnect() {
    this.#endCall("hang-up", true);
    this.ws?.close();
  }

  // ---- public call controls ----

  async startCall(to, callType = "video") {
    if (this.state !== "idle") throw new Error("Already in a call");
    await this.#getMedia(callType); // throws if permission is denied; state stays idle
    this.peer = to.trim().toLowerCase();
    this.callType = callType;
    this.#setState("calling");
    this.#send({ type: "call-request", to: this.peer, callType });
    this.ringTimer = setTimeout(() => this.#endCall("no-answer", true), RING_TIMEOUT_MS);
  }

  async acceptCall() {
    if (this.state !== "ringing") return;
    try {
      await this.#getMedia(this.callType);
      this.#createPeerConnection();
      this.#setState("connecting");
      this.#send({ type: "call-accept", to: this.peer });
    } catch (err) {
      this.#send({ type: "call-reject", to: this.peer, data: { reason: "media-error" } });
      this.#cleanup();
      this.#fail(err);
    }
  }

  rejectCall() {
    if (this.state !== "ringing") return;
    this.#send({ type: "call-reject", to: this.peer, data: { reason: "declined" } });
    this.#endCall("rejected");
  }

  hangUp() {
    if (this.state === "ringing") return this.rejectCall();
    this.#endCall("hang-up", true);
  }

  /** @returns {boolean} true if now muted */
  toggleMute() {
    const track = this.localStream?.getAudioTracks()[0];
    if (!track) return false;
    track.enabled = !track.enabled;
    return !track.enabled;
  }

  /** @returns {boolean} true if camera is now off */
  toggleCamera() {
    const track = this.localStream?.getVideoTracks()[0];
    if (!track) return false;
    track.enabled = !track.enabled;
    return !track.enabled;
  }

  // ---- signaling ----

  async #handleMessage(msg) {
    const { type, from, data } = msg;

    switch (type) {
      case "call-request": {
        if (this.state !== "idle") {
          this.#send({ type: "call-reject", to: from, data: { reason: "busy" } });
          return;
        }
        this.peer = from;
        this.callType = msg.callType ?? "video";
        this.#setState("ringing");
        this.opts.onIncomingCall?.({ from, callType: this.callType });
        return;
      }
      case "call-accept": {
        if (from !== this.peer || this.state !== "calling") return;
        clearTimeout(this.ringTimer);
        this.#setState("connecting");
        this.#createPeerConnection();
        const offer = await this.pc.createOffer();
        await this.pc.setLocalDescription(offer);
        this.#send({ type: "offer", to: this.peer, data: this.pc.localDescription });
        return;
      }
      case "offer": {
        if (from !== this.peer || !this.pc) return;
        await this.pc.setRemoteDescription(data);
        await this.#flushCandidates();
        const answer = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answer);
        this.#send({ type: "answer", to: this.peer, data: this.pc.localDescription });
        return;
      }
      case "answer": {
        if (from !== this.peer || !this.pc) return;
        await this.pc.setRemoteDescription(data);
        await this.#flushCandidates();
        return;
      }
      case "ice-candidate": {
        if (from !== this.peer) return;
        if (this.pc?.remoteDescription) await this.pc.addIceCandidate(data);
        else this.pendingCandidates.push(data); // arrived before the offer/answer was applied
        return;
      }
      case "call-reject": {
        if (from !== this.peer) return;
        this.#endCall(data?.reason === "busy" ? "busy" : "rejected");
        return;
      }
      case "hang-up": {
        if (from !== this.peer) return;
        this.#endCall("hang-up");
        return;
      }
      case "peer-unavailable": {
        if (from !== this.peer) return;
        this.#endCall("unavailable");
        return;
      }
      case "error": {
        this.opts.onError?.(new Error(msg.message ?? "Signaling error"));
        return;
      }
      default:
        return;
    }
  }

  #send(msg) {
    if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(msg));
  }

  // ---- WebRTC ----

  async #getMedia(callType) {
    this.localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: callType === "video",
    });
    this.opts.onLocalStream?.(this.localStream);
  }

  #createPeerConnection() {
    this.pc = new RTCPeerConnection({ iceServers: this.iceServers });
    this.localStream.getTracks().forEach((track) => this.pc.addTrack(track, this.localStream));

    this.pc.onicecandidate = (event) => {
      if (event.candidate) this.#send({ type: "ice-candidate", to: this.peer, data: event.candidate });
    };
    this.pc.ontrack = (event) => this.opts.onRemoteStream?.(event.streams[0]);
    this.pc.onconnectionstatechange = () => {
      const s = this.pc?.connectionState;
      if (s === "connected") {
        clearTimeout(this.disconnectTimer);
        this.#setState("in-call");
      } else if (s === "disconnected") {
        // often transient (network switch); give it a few seconds to recover
        this.disconnectTimer = setTimeout(() => {
          if (this.pc?.connectionState !== "connected") this.#endCall("connection-lost", true);
        }, DISCONNECT_GRACE_MS);
      } else if (s === "failed") {
        this.#endCall("failed", true);
      }
    };
  }

  async #flushCandidates() {
    const queued = this.pendingCandidates;
    this.pendingCandidates = [];
    for (const candidate of queued) await this.pc.addIceCandidate(candidate);
  }

  // ---- lifecycle ----

  #endCall(reason, notifyPeer = false) {
    if (this.state === "idle") return;
    if (notifyPeer && this.peer) this.#send({ type: "hang-up", to: this.peer });
    this.#cleanup();
    this.opts.onCallEnded?.(reason);
  }

  #cleanup() {
    clearTimeout(this.ringTimer);
    clearTimeout(this.disconnectTimer);
    if (this.pc) {
      this.pc.onicecandidate = null;
      this.pc.ontrack = null;
      this.pc.onconnectionstatechange = null;
      this.pc.close();
      this.pc = null;
    }
    this.localStream?.getTracks().forEach((track) => track.stop());
    this.localStream = null;
    this.peer = null;
    this.pendingCandidates = [];
    this.#setState("idle");
  }

  #setState(state) {
    if (this.state === state) return;
    this.state = state;
    this.opts.onStateChange?.(state);
  }

  #fail(err) {
    this.opts.onError?.(err instanceof Error ? err : new Error(String(err)));
  }
}