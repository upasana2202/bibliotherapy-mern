import React from 'react';
import { useMusic, GENRE_PLAYLISTS } from '../context/MusicContext';
import './MusicPage.css';

export default function MusicPage() {
  const { currentGenre, currentTrackIndex, isPlaying, selectGenre, togglePlay, currentTrack, playlist } = useMusic();

  return (
    <div className="music-page">
      <div className="music-header">
        <span className="section-tag">Sonic Healing</span>
        <h1>Music for Every Genre</h1>
        <p className="music-intro">
          Bibliotherapy isn't just reading — it's creating the perfect atmosphere.
          Each book genre pairs with carefully curated classical music to deepen
          your reading experience. All tracks are free, public domain recordings.
        </p>
      </div>

      {/* Now Playing Banner */}
      {currentTrack && (
        <div className="now-playing-banner">
          <div className="np-left">
            <div className="np-pulse"></div>
            <div>
              <div className="np-label">Now Playing</div>
              <div className="np-title">{currentTrack.title}</div>
              <div className="np-artist">{currentTrack.artist}</div>
            </div>
          </div>
          <div className="np-genre" style={{ background: playlist.color + '33' }}>
            {playlist.emoji} {playlist.name}
          </div>
          <button className="np-toggle" onClick={togglePlay}>
            {isPlaying ? '⏸ Pause' : '▶ Resume'}
          </button>
        </div>
      )}

      <div className="genre-cards-grid">
        {Object.entries(GENRE_PLAYLISTS).map(([key, genre]) => (
          <div
            key={key}
            className={`genre-full-card ${currentGenre === key ? 'active' : ''}`}
            style={{ '--card-color': genre.color }}
          >
            <div className="genre-card-header" style={{ background: genre.color + '18' }}>
              <span className="genre-big-emoji">{genre.emoji}</span>
              <div>
                <h3>{genre.name}</h3>
                <p>{genre.description}</p>
              </div>
              {currentGenre === key && isPlaying && (
                <div className="now-playing-badge">♪ Playing</div>
              )}
            </div>

            <div className="genre-tracks">
              {genre.tracks.map((track, i) => (
                <div
                  key={i}
                  className={`track-row ${currentGenre === key && currentTrackIndex === i ? 'active-track' : ''}`}
                >
                  <div className="track-num">
                    {currentGenre === key && currentTrackIndex === i && isPlaying
                      ? <span className="eq-icon">♫</span>
                      : i + 1
                    }
                  </div>
                  <div className="track-info">
                    <div className="track-title">{track.title}</div>
                    <div className="track-artist">{track.artist}</div>
                  </div>
                  <div className="track-duration">{track.duration}</div>
                </div>
              ))}
            </div>

            <button
              className={`genre-play-btn ${currentGenre === key && isPlaying ? 'playing' : ''}`}
              onClick={() => {
                if (currentGenre === key) {
                  togglePlay();
                } else {
                  selectGenre(key);
                }
              }}
            >
              {currentGenre === key && isPlaying
                ? `⏸ Pause`
                : `▶ Play ${genre.name}`}
            </button>
          </div>
        ))}
      </div>

      <div className="music-note">
        <div className="music-note-icon">🎵</div>
        <div>
          <h4>About the Music</h4>
          <p>
            All music is streamed directly from <strong>Wikimedia Commons</strong> — 
            100% free public domain classical recordings. No ads, no login required.
            Use headphones for the best experience! 🎧 The player bar at the bottom
            controls playback — use ⏮ ⏭ to switch tracks within a genre.
          </p>
        </div>
      </div>

      <div className="therapy-info">
        <h2>The Science of Music & Reading</h2>
        <div className="therapy-grid">
          {[
            { icon: "🧠", title: "Neurological Impact", desc: "Music engages the limbic system — the brain's emotional center — creating neurological pathways that support healing and mood regulation." },
            { icon: "💙", title: "Emotional Resonance", desc: "Matching music to a book's emotional tone creates a resonant experience, allowing readers to process difficult emotions more safely." },
            { icon: "🎯", title: "Enhanced Focus", desc: "Baroque compositions at 60-70 BPM (like Bach) have been shown to enhance concentration and reading retention by up to 40%." },
            { icon: "🌊", title: "Nervous System Regulation", desc: "Slow classical music activates the parasympathetic nervous system, reducing anxiety and creating ideal conditions for deep reading." },
          ].map((item, i) => (
            <div key={i} className="therapy-card">
              <div className="therapy-icon">{item.icon}</div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
