import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/api.js';
import { saveConnectedUser } from '../lib/session.js';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiRequest('/api/v1/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      // 1. Save the JWT token to localStorage so apiRequest can use it
      localStorage.setItem("accessToken", response.accessToken);
      
      // 2. Save just the user object details to your session state
      saveConnectedUser(response.user); 
      
      // 3. Navigate to the dashboard
      navigate('/dashboard', { replace: true });
      
    } catch (err) {
      setError(err.message || 'Login failed. Check your email and password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-layout">
      <section className="brand-panel">
        <div className="brand-mark">V</div>
        <p className="eyebrow">VIDEO CALL</p>
        <h1>Meet face to face, wherever you are.</h1>
        <p className="muted">Create a room or join your team in seconds.</p>
        <div className="brand-orb" aria-hidden="true" />
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <p className="eyebrow">WELCOME BACK</p>
          <h2>Sign in</h2>
          <p className="muted">Enter your account details to continue.</p>

          <form onSubmit={handleSubmit} className="form">
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" autoComplete="email" required
              value={email} onChange={(e) => setEmail(e.target.value)} />

            <label htmlFor="password">Password</label>
            <input id="password" type="password" autoComplete="current-password"
              required value={password} onChange={(e) => setPassword(e.target.value)} />

            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="button button-primary" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="auth-switch">New to VideoCall? <Link to="/register">Create an account</Link></p>
        </div>
      </section>
    </main>
  );
}
