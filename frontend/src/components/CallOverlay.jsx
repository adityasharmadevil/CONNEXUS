import { useEffect, useRef } from 'react';
import { useCall } from '../context/CallContext.jsx';

function MediaView({ stream, muted = false, className }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream ?? null;
  }, [stream]);
  return <video ref={ref} className={className} autoPlay playsInline muted={muted} />;
}

export default function CallOverlay() {
  const {
    callState, peer, callType, localStream, remoteStream, muted, cameraOff, notice,
    acceptCall, rejectCall, hangUp, toggleMute, toggleCamera, dismissNotice,
  } = useCall();

  const isVideo = callType === 'video';
  const initial = (peer || '?').slice(0, 1).toUpperCase();

  return (
    <>
      {notice && (
        <div className="call-toast" role="status" onClick={dismissNotice}>
          {notice}
        </div>
      )}

      {callState === 'ringing' && (
        <div className="call-overlay" role="dialog" aria-label="Incoming call">
          <div className="call-card">
            <div className="avatar">{initial}</div>
            <p className="eyebrow">INCOMING {isVideo ? 'VIDEO' : 'AUDIO'} CALL</p>
            <h2>{peer}</h2>
            <div className="call-actions">
              <button className="button button-danger" onClick={rejectCall}>Decline</button>
              <button className="button button-primary" onClick={acceptCall}>Accept</button>
            </div>
          </div>
        </div>
      )}

      {callState === 'calling' && (
        <div className="call-overlay" role="dialog" aria-label="Calling">
          <div className="call-card">
            <div className="avatar">{initial}</div>
            <p className="eyebrow">CALLING…</p>
            <h2>{peer}</h2>
            <p className="muted">Waiting for them to answer.</p>
            <div className="call-actions">
              <button className="button button-danger" onClick={hangUp}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {(callState === 'connecting' || callState === 'in-call') && (
        <div className="call-overlay" role="dialog" aria-label="Call in progress">
          <div className="call-stage">
            <MediaView stream={remoteStream} className="call-remote" />
            {(!isVideo || !remoteStream) && (
              <div className="call-audio-placeholder">
                <div className="avatar">{initial}</div>
                <h2>{peer}</h2>
                <p className="muted">{callState === 'in-call' ? 'Audio call' : 'Connecting…'}</p>
              </div>
            )}
            {isVideo && <MediaView stream={localStream} muted className="call-local" />}
            <div className="call-controls">
              <button className="button button-ghost" onClick={toggleMute}>
                {muted ? 'Unmute' : 'Mute'}
              </button>
              {isVideo && (
                <button className="button button-ghost" onClick={toggleCamera}>
                  {cameraOff ? 'Camera on' : 'Camera off'}
                </button>
              )}
              <button className="button button-danger" onClick={hangUp}>Hang up</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}