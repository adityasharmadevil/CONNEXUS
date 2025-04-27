import React, { useState } from "react";
import { Video, VideoOff, Mic, MicOff, PhoneOff } from "lucide-react";

const CallWindow = ({ type, onClose }) => {
  const [videoEnabled, setVideoEnabled] = useState(type === "video"); // If initial type is video, it's ON. Else OFF.
  const [micEnabled, setMicEnabled] = useState(true);

  const toggleVideo = () => setVideoEnabled(!videoEnabled);
  const toggleMic = () => setMicEnabled(!micEnabled);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl w-[400px] md:w-[500px] flex flex-col items-center shadow-lg relative">
        
        {/* App Name */}
        <h1 className="text-3xl font-bold text-cyan-600 mb-4">Connexus</h1>

        {/* Call Type */}
        <h2 className="text-xl font-semibold mb-2">
          {videoEnabled ? "Video Call" : type === "audio" ? "Audio Call" : "Video Call"}
        </h2>
        <p className="text-gray-500 mb-6">Connecting...</p>

        {/* Show Video Frame If Video Enabled */}
        {videoEnabled && (
          <div className="w-[300px] h-[200px] bg-gray-300 rounded-lg mb-6 flex items-center justify-center">
            <p className="text-gray-600">Video Stream Here</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-center gap-6">
          {/* Toggle Video */}
          <button
            onClick={toggleVideo}
            className="bg-cyan-500 p-3 rounded-full hover:bg-cyan-600 transition"
          >
            {videoEnabled ? (
              <Video size={24} className="text-white" />
            ) : (
              <VideoOff size={24} className="text-white" />
            )}
          </button>

          {/* Toggle Mic */}
          <button
            onClick={toggleMic}
            className="bg-cyan-500 p-3 rounded-full hover:bg-cyan-600 transition"
          >
            {micEnabled ? (
              <Mic size={24} className="text-white" />
            ) : (
              <MicOff size={24} className="text-white" />
            )}
          </button>

          {/* End Call */}
          <button
            onClick={onClose}
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
 