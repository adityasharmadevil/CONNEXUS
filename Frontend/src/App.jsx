import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CallOverlay from './components/CallOverlay.jsx';
import { CallProvider } from './context/CallContext.jsx';
import { getConnectedUser, getToken } from './lib/session.js';
 
// Guards the protected pages and keeps one call connection alive for all of them,
// so incoming calls ring whichever page the user is on.
function RequireAuth() {
  if (!getConnectedUser() || !getToken()) return <Navigate to="/login" replace />;
  return (
    <CallProvider>
      <Outlet />
      <CallOverlay />
    </CallProvider>
  );
}
 
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
 
