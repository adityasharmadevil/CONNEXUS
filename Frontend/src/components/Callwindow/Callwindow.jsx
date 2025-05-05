import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './Callwindow.css';
import { Video, VideoOff, Mic, MicOff, PhoneOff } from "lucide-react";

const CallWindow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, type = "video" } = location.state || {};

  const [videoEnabled, setVideoEnabled] = useState(type === "video");
  const [micEnabled, setMicEnabled] = useState(true);

  useEffect(() => {
    // If no user info is passed, redirect back
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const toggleVideo = () => setVideoEnabled(!videoEnabled);
  const toggleMic = () => setMicEnabled(!micEnabled);
  const handleEndCall = () => navigate('/');

  return (
    <div className="main fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col">
      {/* Header */}
      <div className="header">
        <h1 className="text-white font-['Playwrite_IN'] font-semibold text-[2vw] py-[2vw] px-[3vw]">Connexus</h1>
      </div>

      {/* Call Window */}
      <div className="callbox p-8 rounded-2xl w-[90vw] mx-auto flex flex-col items-center shadow-lg relative">
        <h2 className="text-xl font-semibold mb-2 text-white">
          {type === "audio" && !videoEnabled ? "Audio Call" : "Video Call"} with {user?.fullName}
        </h2>
        <p className="text-gray-400 mb-6">Connecting to {user?.fullName}...</p>

        {/* Video Preview */}
        <div className="videopreview w-[300px] h-[200px] bg-gray-800 rounded-lg mb-6 flex items-center justify-center border border-gray-600">
          {videoEnabled ? (
            <p className="text-white">[Video Stream Here]</p>
          ) : (
            <p className="text-gray-500 italic">Camera is off</p>
          )}
        </div>

        {/* Controls */}
        <div className="btnbox border-2 border-white p-3 flex justify-center gap-6">
          {/* Toggle Video */}
          <button
            onClick={toggleVideo}
            className="bg-cyan-500 p-3 rounded-full hover:bg-cyan-600 transition"
          >
            {videoEnabled ? <Video size={24} className="text-white" /> : <VideoOff size={24} className="text-white" />}
          </button>

          {/* Toggle Mic */}
          <button
            onClick={toggleMic}
            className="bg-cyan-500 p-3 rounded-full hover:bg-cyan-600 transition"
          >
            {micEnabled ? <Mic size={24} className="text-white" /> : <MicOff size={24} className="text-white" />}
          </button>

          {/* End Call */}
          <button
            onClick={handleEndCall}
            className="bg-red-500 p-3 rounded-full hover:bg-red-600 transition"
          >
            <PhoneOff size={24} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallWindow;
