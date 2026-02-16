import React from 'react';
import { NavLink } from 'react-router-dom';

const baseLinkStyle = {
  display: 'block',
  padding: '8px 10px',
  borderRadius: '6px',
  textDecoration: 'none',
};

export default function Sidebar() {
  return (
    <nav aria-label="Sidebar navigation" style={{ display: 'grid', gap: '8px' }}>
      <NavLink
        to="/dashboard"
        style={({ isActive }) => ({
          ...baseLinkStyle,
          color: isActive ? '#111827' : '#374151',
          backgroundColor: isActive ? '#dbeafe' : 'transparent',
          fontWeight: isActive ? 600 : 400,
        })}
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/profile"
        style={({ isActive }) => ({
          ...baseLinkStyle,
          color: isActive ? '#111827' : '#374151',
          backgroundColor: isActive ? '#dbeafe' : 'transparent',
          fontWeight: isActive ? 600 : 400,
        })}
      >
        Profile
      </NavLink>
    </nav>
  );
}
