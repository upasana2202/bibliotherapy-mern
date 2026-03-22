import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isLoggedIn } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowMenu(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">📚</span>
        <span className="brand-text">Bibliotherapy</span>
        <span className="brand-sub">Healing Through Books</span>
      </Link>

      <div className="navbar-links">
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
        <Link to="/chat" className={`nav-link nav-cta ${isActive('/chat') ? 'active' : ''}`}>
          💬 Talk to Sage
        </Link>
        <Link to="/library" className={`nav-link ${isActive('/library') ? 'active' : ''}`}>Library</Link>
        <Link to="/music" className={`nav-link ${isActive('/music') ? 'active' : ''}`}>🎵 Music</Link>

        {isLoggedIn ? (
          <div className="nav-user" onClick={() => setShowMenu(!showMenu)}>
            <div className="nav-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <span className="nav-username">{user?.name?.split(' ')[0]}</span>
            {showMenu && (
              <div className="nav-dropdown">
                <Link to="/profile" onClick={() => setShowMenu(false)}>👤 My Profile</Link>
                <Link to="/profile" onClick={() => setShowMenu(false)}>❤️ Favourites ({user?.favourites?.length || 0})</Link>
                <Link to="/profile" onClick={() => setShowMenu(false)}>📚 Reading List</Link>
                <hr />
                <button onClick={handleLogout}>🚪 Sign Out</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/auth" className={`nav-link nav-signin ${isActive('/auth') ? 'active' : ''}`}>
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
