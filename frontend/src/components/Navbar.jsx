import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
      }}
    >
      <Link to="/dashboard" style={{ fontWeight: 700, color: '#111827', textDecoration: 'none' }}>
        DevCollab
      </Link>

      {token ? (
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </header>
  );
}
