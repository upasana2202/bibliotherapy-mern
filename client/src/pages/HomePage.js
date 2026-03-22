import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMusic } from '../context/MusicContext';
import { GENRE_PLAYLISTS } from '../context/MusicContext';
import './HomePage.css';

const MOODS = [
  { label: "Grief & Loss", emoji: "🌧", mood: "grief", color: "#6B7280" },
  { label: "Anxiety & Stress", emoji: "🌊", mood: "anxiety", color: "#93C5FD" },
  { label: "Hope & Resilience", emoji: "🌅", mood: "hope", color: "#FCD34D" },
  { label: "Love & Connection", emoji: "💕", mood: "love", color: "#F472B6" },
  { label: "Identity & Purpose", emoji: "🧭", mood: "purpose", color: "#A78BFA" },
  { label: "Depression", emoji: "🌑", mood: "depression", color: "#374151" },
  { label: "Joy & Wonder", emoji: "✨", mood: "joy", color: "#34D399" },
  { label: "Healing & Recovery", emoji: "🌱", mood: "healing", color: "#6EE7B7" },
];

export default function HomePage() {
  const { isLoggedIn, user } = useAuth();
  const { selectGenre } = useMusic();

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">✦ Bibliotherapy ✦</span>
          <h1 className="hero-title">
            Heal Through
            <em> the Right Book</em>
          </h1>
          <p className="hero-subtitle">
            For every emotion, every struggle, every quiet joy — there is a book waiting for you.
            Let Sage, your AI bibliotherapy guide, find it.
          </p>
          <div className="hero-actions">
            <Link to="/chat" className="btn-primary">
              💬 Talk to Sage
            </Link>
            <Link to="/library" className="btn-secondary">
              📚 Browse Library
            </Link>
            {!isLoggedIn ? (
              <Link to="/auth" className="btn-ghost">
                🌱 Create Free Account
              </Link>
            ) : (
              <span className="hero-welcome">
                Welcome back, {user?.name?.split(' ')[0]}! 🌿
              </span>
            )}
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-n">100</span>
              <span className="stat-l">Curated Books</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-n">10</span>
              <span className="stat-l">Music Genres</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-n">AI</span>
              <span className="stat-l">Powered Sage</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="book-stack">
            {['#F472B6','#A78BFA','#6EE7B7','#FCD34D','#93C5FD'].map((c, i) => (
              <div key={i} className="book-spine-hero" style={{ background: c, '--i': i }} />
            ))}
          </div>
        </div>
      </section>

      {/* Mood Section */}
      <section className="mood-section">
        <div className="section-header">
          <span className="section-tag">Find Your Book</span>
          <h2>How are you feeling today?</h2>
          <p>Choose a mood and discover books curated for exactly where you are</p>
        </div>
        <div className="mood-grid">
          {MOODS.map(m => (
            <Link
              key={m.mood}
              to={`/library?mood=${m.mood}`}
              className="mood-card"
              style={{ '--mood-color': m.color }}
            >
              <span className="mood-emoji">{m.emoji}</span>
              <span className="mood-label">{m.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-tag">Everything You Need</span>
          <h2>Your Complete Reading Sanctuary</h2>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Talk to Sage</h3>
            <p>Share how you're feeling. Sage listens and recommends books with warmth and wisdom.</p>
            <Link to="/chat" className="feature-link">Start conversation →</Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Healing Library</h3>
            <p>100 books curated across every emotion — grief, anxiety, joy, trauma, and more.</p>
            <Link to="/library" className="feature-link">Browse books →</Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎵</div>
            <h3>Reading Music</h3>
            <p>10 ambient soundscapes generated for each book genre to enhance your reading.</p>
            <Link to="/music" className="feature-link">Listen now →</Link>
          </div>
          {!isLoggedIn ? (
            <div className="feature-card feature-card-cta">
              <div className="feature-icon">🌱</div>
              <h3>Save Your Journey</h3>
              <p>Create a free account to save favourite books, track your reading list, and remember your chats with Sage.</p>
              <Link to="/auth" className="feature-link feature-link-cta">Create free account →</Link>
            </div>
          ) : (
            <div className="feature-card feature-card-cta">
              <div className="feature-icon">👤</div>
              <h3>Your Profile</h3>
              <p>View your favourites, reading list, and track your healing journey.</p>
              <Link to="/profile" className="feature-link feature-link-cta">View profile →</Link>
            </div>
          )}
        </div>
      </section>

      {/* Music Preview */}
      <section className="music-section">
        <div className="section-header">
          <span className="section-tag">Ambient Music</span>
          <h2>Music for Every Genre</h2>
          <p>Click a genre to start playing</p>
        </div>
        <div className="music-grid">
          {Object.entries(GENRE_PLAYLISTS).slice(0, 6).map(([key, playlist]) => (
            <button
              key={key}
              className="music-card"
              style={{ '--music-color': playlist.color }}
              onClick={() => selectGenre(key)}
            >
              <span className="music-emoji">{playlist.emoji}</span>
              <span className="music-name">{playlist.name}</span>
              <span className="music-desc">{playlist.description}</span>
            </button>
          ))}
        </div>
        <div className="music-cta">
          <Link to="/music" className="btn-secondary">View All 10 Genres →</Link>
        </div>
      </section>

      {/* CTA Banner */}
      {!isLoggedIn && (
        <section className="cta-banner">
          <h2>Begin Your Healing Journey</h2>
          <p>Join thousands of readers who have found comfort, meaning, and joy through bibliotherapy.</p>
          <div className="cta-buttons">
            <Link to="/auth" className="btn-primary">Create Free Account</Link>
            <Link to="/chat" className="btn-ghost-light">Talk to Sage First</Link>
          </div>
        </section>
      )}
    </div>
  );
}
