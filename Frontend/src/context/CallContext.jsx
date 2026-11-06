import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { CallClient } from '../lib/CallClient.js';
import { getToken } from '../lib/session.js';

const CallContext = createContext(null);

export function useCall() {
  const ctx = useContext(CallContext);
  if (!ctx) throw new Error('useCall must be used inside <CallProvider>');
  return ctx;
}

const END_REASONS = {
  rejected: 'Call declined',
  busy: 'The user is busy on another call',
  unavailable: 'The user is offline',
  'no-answer': 'No answer',
  'connection-lost': 'Connection lost',
  failed: 'Could not establish the connection',
  'hang-up': 'Call ended',
  'signaling-closed': 'Disconnected from the call server',
};

function mediaErrorText(err) {
  if (err?.name === 'NotAllowedError') return 'Camera or microphone permission was denied';
  if (err?.name === 'NotFoundError') return 'No camera or microphone was found';
  if (err?.name === 'NotReadableError') return 'Your camera or microphone is in use by another app';
  return err?.message || 'Something went wrong with the call';
}

function signalingUrl() {
  const base = import.meta.env.VITE_API_BASE_URL;
  const url = base ? new URL(base, window.location.href) : window.location;
  const protocol = url.protocol === 'https:' ? 'wss' : 'ws';
  return `${protocol}://${url.host}/ws/signaling`;
}

export function CallProvider({ children }) {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [callState, setCallState] = useState('idle'); // idle | calling | ringing | connecting | in-call
  const [peer, setPeer] = useState(null);
  const [callType, setCallType] = useState('video');
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const token = getToken();
    if (!token) return undefined;

    let active = true; // guards against late callbacks (React StrictMode mounts effects twice)
    const client = new CallClient({
      wsUrl: signalingUrl(),
      token,
      onStateChange: (state) => {
        if (!active) return;
        setCallState(state);
        setPeer(client.peer);
        setCallType(client.callType);
      },
      onLocalStream: (stream) => active && setLocalStream(stream),
      onRemoteStream: (stream) => active && setRemoteStream(stream),
      onCallEnded: (reason) => {
        if (!active) return;
        setLocalStream(null);
        setRemoteStream(null);
        setMuted(false);
        setCameraOff(false);
        setNotice(END_REASONS[reason] ?? 'Call ended');
      },
      onError: (err) => active && setNotice(mediaErrorText(err)),
      onDisconnected: () => active && setConnected(false),
    });
    clientRef.current = client;

    client
      .connect()
      .then(() => active && setConnected(true))
      .catch(() => active && setNotice('Could not connect to the call server'));

    return () => {
      active = false;
      client.disconnect();
      clientRef.current = null;
      setConnected(false);
    };
  }, []);

  // Toast disappears on its own
  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(''), 4500);
    return () => clearTimeout(timer);
  }, [notice]);

  const startCall = useCallback(
    async (email, type = 'video') => {
      setNotice('');
      if (!connected || !clientRef.current) {
        setNotice('Not connected to the call server');
        return;
      }
      try {
        await clientRef.current.startCall(email, type);
      } catch (err) {
        setNotice(mediaErrorText(err));
      }
    },
    [connected],
  );

  const value = {
    connected,
    callState,
    peer,
    callType,
    localStream,
    remoteStream,
    muted,
    cameraOff,
    notice,
    dismissNotice: () => setNotice(''),
    startCall,
    acceptCall: () => clientRef.current?.acceptCall(),
    rejectCall: () => clientRef.current?.rejectCall(),
    hangUp: () => clientRef.current?.hangUp(),
    toggleMute: () => setMuted(clientRef.current?.toggleMute() ?? false),
    toggleCamera: () => setCameraOff(clientRef.current?.toggleCamera() ?? false),
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
}