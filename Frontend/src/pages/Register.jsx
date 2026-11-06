import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/api.js';
import { saveConnectedUser } from '../lib/session.js';

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
  // FIXED: Changed route path from '/api/v1/users/' to '/api/v1/users/register'
  const user = await apiRequest('/api/v1/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password, status: 'ONLINE' }), // Kept statuses uppercase to align with standard Java Enums
  });
  
  saveConnectedUser(user);
  navigate('/dashboard', { replace: true });
} catch (err) {
  setError(err.message || 'Registration failed. Please try again.');
} finally {
  setLoading(false);
}
  }

  return (
    <main className="auth-layout">
      <section className="brand-panel">
        <div className="brand-mark">V</div>
        <p className="eyebrow">JOIN VIDEO CALL</p>
        <h1>Good conversations start here.</h1>
        <p className="muted">Create your account to start meeting online.</p>
        <div className="brand-orb" aria-hidden="true" />
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <p className="eyebrow">GET STARTED</p>
          <h2>Create account</h2>

          <form onSubmit={handleSubmit} className="form">
            <label htmlFor="username">Username</label>
            <input id="username" type="text" autoComplete="username" required
              minLength={2} value={username} onChange={(e) => setUsername(e.target.value)} />

            <label htmlFor="email">Email address</label>
            <input id="email" type="email" autoComplete="email" required
              value={email} onChange={(e) => setEmail(e.target.value)} />

            <label htmlFor="password">Password</label>
            <input id="password" type="password" autoComplete="new-password"
              required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />

            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="button button-primary" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
        </div>
      </section>
    </main>
  );
}
