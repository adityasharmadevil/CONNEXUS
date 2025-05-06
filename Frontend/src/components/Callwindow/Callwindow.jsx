import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './Callwindow.css';
import { Video, VideoOff, Mic, MicOff, PhoneOff } from "lucide-react";

const CallWindow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, type = "video" } = location.state || {};

  const [videoEnabled, setVideoEnabled] = useState(type === "video");
  const [micEnabled, setMicEnabled] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [callStartTime, setCallStartTime] = useState(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  const peerConnection = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const signalingServer = useRef(null);

  const YOUR_ID = "caller-unique-id"; // Replace with actual caller ID logic

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    setVideoEnabled(true);
    setMicEnabled(true);
    
    requestMediaPermissions();
    setupWebSocket();
  }, [user]);

  const requestMediaPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: videoEnabled, audio: micEnabled });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.muted = true;
      }
      setPermissionsGranted(true);
      stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));
    } catch (err) {
      console.error("Error accessing media devices", err);
      alert("Please grant permission to access your camera and microphone.");
    }
  };

  const setupWebSocket = () => {
    signalingServer.current = new WebSocket("ws://localhost:8080/ws");

    signalingServer.current.onopen = () => {
      console.log("WebSocket connected!");
    };

    signalingServer.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.sdp) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
        if (data.type === "offer") {
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          signalingServer.current.send(JSON.stringify({ type: "answer", sdp: answer }));
        }
      } else if (data.candidate) {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    };

    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    peerConnection.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };
  };

  const toggleVideo = () => {
    const videoTracks = localVideoRef.current.srcObject.getVideoTracks();
    videoTracks.forEach(track => track.enabled = !track.enabled);
    setVideoEnabled(prev => !prev);
  };

  const toggleMic = () => {
    const audioTracks = localVideoRef.current.srcObject.getAudioTracks();
    audioTracks.forEach(track => track.enabled = !track.enabled);
    setMicEnabled(prev => !prev);
  };

  const handleEndCall = async () => {
    if (peerConnection.current) peerConnection.current.close();
    if (signalingServer.current) signalingServer.current.close();
    alert("Call Ended");
    navigate('/contacts');
  };

  return (
    <div className="main fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col">
      <div className="header">
        <h1 className="text-white font-['Playwrite_IN'] font-semibold text-[2vw] py-[2vw] px-[3vw]">Connexus</h1>
      </div>

      <div className="callbox p-8 rounded-2xl w-[90vw] mx-auto flex flex-col items-center shadow-lg relative">
        <h2 className="text-xl font-semibold mb-2 text-white">
          {type === "audio" && !videoEnabled ? "Audio Call" : "Video Call"} with {user?.fullName}
        </h2>
        <p className="text-gray-400 mb-6">Connecting to {user?.fullName}...</p>

        <div className="call-container flex w-full gap-4">
          {/* Local Video on Left */}
          <div className="local-video w-[300px] h-[200px] bg-gray-800 rounded-lg flex items-center justify-center border border-gray-600">
            <video ref={localVideoRef} autoPlay playsInline muted></video>
          </div>

          {/* Remote Video on Right */}
          <div className="remote-video w-[300px] h-[200px] bg-gray-800 rounded-lg flex items-center justify-center border border-gray-600">
            <video ref={remoteVideoRef} autoPlay playsInline></video>
          </div>
        </div>

        <div className="btnbox border-2 border-white p-3 flex justify-center gap-6 mt-6">
          <button onClick={toggleVideo} className="bg-cyan-500 p-3 rounded-full hover:bg-cyan-600 transition">
            {videoEnabled ? <Video size={24} className="text-white" /> : <VideoOff size={24} className="text-white" />}
          </button>

          <button onClick={toggleMic} className="bg-cyan-500 p-3 rounded-full hover:bg-cyan-600 transition">
            {micEnabled ? <Mic size={24} className="text-white" /> : <MicOff size={24} className="text-white" />}
          </button>

          <button onClick={handleEndCall} className="bg-red-500 p-3 rounded-full hover:bg-red-600 transition">
            <PhoneOff size={24} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallWindow;
