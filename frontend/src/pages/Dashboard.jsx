import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/api.js';
import { clearSession, getConnectedUser } from '../lib/session.js';
import { useCall } from '../context/CallContext.jsx';

const REFRESH_MS = 15000;

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getConnectedUser();
  const { connected, callState, startCall } = useCall();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [targetEmail, setTargetEmail] = useState('');

  const loadUsers = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/api/v1/users');
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Could not load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
    const timer = setInterval(() => loadUsers(true), REFRESH_MS);
    return () => clearInterval(timer);
  }, [loadUsers]);

  async function handleLogout() {
    try {
      await apiRequest('/api/v1/users/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout request failed:', err);
    } finally {
      clearSession();
      navigate('/login', { replace: true });
    }
  }

  function callByEmail(type) {
    const email = targetEmail.trim();
    if (email) startCall(email, type);
  }

  const idle = callState === 'idle';

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <a
          className="wordmark"
          href="/dashboard"
          onClick={(e) => {
            e.preventDefault();
            navigate('/dashboard');
          }}
        >
          <span className="brand-mark small">V</span> VideoCall
        </a>
        <div className="topbar-right">
          <span className="welcome">
            <span className={`conn-dot ${connected ? 'on' : ''}`} />
            Hi, {user?.username || user?.email || 'there'}
          </span>
          <button className="button button-ghost" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>

      <section className="dashboard-content">
        <div className="dashboard-heading">
          <p className="eyebrow">YOUR WORKSPACE</p>
          <h1>Call anyone, face to face.</h1>
          <p className="muted">
            Pick someone who is online below, or call an email address directly.
            {!connected && ' Connecting to the call server…'}
          </p>
        </div>

        <div className="meeting-grid">
          <article className="panel meeting-panel">
            <div className="panel-icon">☎</div>
            <h2>Call by email</h2>
            <p className="muted">Enter the email of a registered user who is online.</p>
            <form
              className="join-form call-by-email"
              onSubmit={(e) => {
                e.preventDefault();
                callByEmail('video');
              }}
            >
              <input
                type="email"
                aria-label="Email to call"
                placeholder="friend@example.com"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                required
              />
              <button className="button button-primary" type="submit" disabled={!connected || !idle}>
                Video call
              </button>
              <button
                className="button button-secondary"
                type="button"
                disabled={!connected || !idle || !targetEmail.trim()}
                onClick={() => callByEmail('audio')}
              >
                Audio call
              </button>
            </form>
          </article>
        </div>

        <section className="users-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">COMMUNITY</p>
              <h2>Registered users</h2>
            </div>
            <button className="button button-ghost" onClick={() => loadUsers()}>
              Refresh
            </button>
          </div>

          {loading && <p className="muted">Loading users…</p>}
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          {!loading && !error && users.length === 0 && (
            <p className="empty-state">No users to display yet.</p>
          )}

          {!loading && users.length > 0 && (
            <ul className="user-list">
              {users.map((item) => {
                const isSelf = item.email === user?.email;
                const online = item.status === 'ACTIVE';
                const canCall = connected && idle && online && !isSelf;
                return (
                  <li className="user-row" key={item.id ?? item.email}>
                    <div className="avatar">
                      {(item.username || item.email || '?').slice(0, 1).toUpperCase()}
                    </div>
                    <div className="user-details">
                      <strong>
                        {item.username || 'Unnamed user'}
                        {isSelf && ' (you)'}
                      </strong>
                      <span>{item.email || 'No email provided'}</span>
                    </div>
                    <span className={`status ${online ? 'status-online' : 'status-offline'}`}>
                      <i /> {online ? 'online' : 'offline'}
                    </span>
                    {!isSelf && (
                      <div className="user-actions">
                        <button
                          className="button button-primary button-small"
                          disabled={!canCall}
                          title={online ? 'Start a video call' : 'User is offline'}
                          onClick={() => startCall(item.email, 'video')}
                        >
                          Video
                        </button>
                        <button
                          className="button button-ghost button-small"
                          disabled={!canCall}
                          title={online ? 'Start an audio call' : 'User is offline'}
                          onClick={() => startCall(item.email, 'audio')}
                        >
                          Audio
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}