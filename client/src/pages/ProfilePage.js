import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

const STATUS_LABELS = {
  want: { label: 'Want to Read', emoji: '📌', color: '#F59E0B' },
  reading: { label: 'Currently Reading', emoji: '📖', color: '#6EE7B7' },
  finished: { label: 'Finished', emoji: '✅', color: '#34D399' },
};

export default function ProfilePage() {
  const { user, logout, updateReadingList } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('reading');

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-empty">
          <p>Please <button onClick={() => navigate('/auth')}>sign in</button> to view your profile.</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const readingByStatus = {
    want: user.readingList?.filter(i => i.status === 'want') || [],
    reading: user.readingList?.filter(i => i.status === 'reading') || [],
    finished: user.readingList?.filter(i => i.status === 'finished') || [],
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h1>{user.name}</h1>
          <p>{user.email}</p>
          <p className="profile-joined">Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
        </div>
        <button className="profile-logout" onClick={handleLogout}>
          Sign Out
        </button>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div className="stat-card">
          <span className="stat-num">{user.favourites?.length || 0}</span>
          <span className="stat-label">❤️ Favourites</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{readingByStatus.reading.length}</span>
          <span className="stat-label">📖 Reading Now</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{readingByStatus.finished.length}</span>
          <span className="stat-label">✅ Finished</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{readingByStatus.want.length}</span>
          <span className="stat-label">📌 Want to Read</span>
        </div>
      </div>

      {/* Reading List Tabs */}
      <div className="profile-section">
        <h2>My Reading Journey</h2>
        <div className="profile-tabs">
          {Object.entries(STATUS_LABELS).map(([key, val]) => (
            <button
              key={key}
              className={`profile-tab ${activeTab === key ? 'active' : ''}`}
              style={{ '--tab-color': val.color }}
              onClick={() => setActiveTab(key)}
            >
              {val.emoji} {val.label} ({readingByStatus[key].length})
            </button>
          ))}
        </div>

        <div className="reading-list">
          {readingByStatus[activeTab].length === 0 ? (
            <div className="reading-empty">
              <p>No books here yet. <button onClick={() => navigate('/library')}>Browse the library</button> to add some!</p>
            </div>
          ) : (
            readingByStatus[activeTab].map(item => (
              <div key={item.bookId} className="reading-item">
                <div className="reading-book-id">#{item.bookId}</div>
                <div className="reading-book-info">
                  <p>Book ID: {item.bookId}</p>
                  <span className="reading-status" style={{ background: STATUS_LABELS[item.status]?.color + '22', color: STATUS_LABELS[item.status]?.color }}>
                    {STATUS_LABELS[item.status]?.emoji} {STATUS_LABELS[item.status]?.label}
                  </span>
                </div>
                <div className="reading-actions">
                  {item.status !== 'reading' && (
                    <button onClick={() => updateReadingList(item.bookId, 'reading')}>📖 Reading</button>
                  )}
                  {item.status !== 'finished' && (
                    <button onClick={() => updateReadingList(item.bookId, 'finished')}>✅ Done</button>
                  )}
                  <button className="remove-btn" onClick={() => updateReadingList(item.bookId, 'remove')}>✕</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
