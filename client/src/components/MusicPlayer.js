import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useMusic } from '../context/MusicContext';
import './MusicPlayer.css';

// Web Audio API ambient music generator
// Creates real music using oscillators, filters, reverb - no internet needed!
class AmbientMusicEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.nodes = [];
    this.scheduledNotes = [];
    this.playing = false;
  }

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.4;

    // Reverb convolver for ambient feel
    this.reverb = this.ctx.createConvolver();
    const reverbBuffer = this.createReverbBuffer(2.5);
    this.reverb.buffer = reverbBuffer;
    this.reverb.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    // Dry signal path
    this.dryGain = this.ctx.createGain();
    this.dryGain.gain.value = 0.3;
    this.dryGain.connect(this.masterGain);
  }

  createReverbBuffer(duration) {
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.ctx.createBuffer(2, length, sampleRate);
    for (let c = 0; c < 2; c++) {
      const data = buffer.getChannelData(c);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      }
    }
    return buffer;
  }

  // Scale definitions for different moods
  getScale(config) {
    const scales = {
      peaceful:      [0, 2, 4, 7, 9],        // Pentatonic major
      tender:        [0, 2, 4, 5, 7, 9, 11],  // Major
      noir:          [0, 2, 3, 5, 7, 8, 10],  // Dorian
      magical:       [0, 2, 3, 6, 7, 9, 11],  // Lydian
      cosmic:        [0, 2, 4, 6, 8, 10],     // Whole tone
      thoughtful:    [0, 2, 4, 5, 7, 9, 11],  // Major
      positive:      [0, 2, 4, 7, 9],         // Pentatonic
      nostalgic:     [0, 2, 3, 5, 7, 9, 10],  // Mixolydian
      introspective: [0, 1, 3, 5, 7, 8, 10],  // Phrygian
      dignified:     [0, 2, 4, 5, 7, 9, 11],  // Major
    };
    return scales[config.mood] || scales.peaceful;
  }

  noteToFreq(midiNote) {
    return 440 * Math.pow(2, (midiNote - 69) / 12);
  }

  playNote(freq, startTime, duration, type = 'sine', gainVal = 0.15) {
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.value = 800;

    osc.type = type;
    osc.frequency.value = freq;

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(gainVal, startTime + 0.1);
    gainNode.gain.setValueAtTime(gainVal, startTime + duration * 0.7);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.reverb);
    gainNode.connect(this.dryGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);

    this.nodes.push(osc);
    return osc;
  }

  startMusic(config, volume) {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    this.playing = true;
    this.masterGain.gain.value = volume;

    const scale = this.getScale(config);
    const baseNote = Math.round(12 * Math.log2(config.baseFreq / 440)) + 69;
    const beatDuration = 60 / config.tempo;

    // Bass drone
    const droneFreq = config.baseFreq / 2;
    const droneOsc = this.ctx.createOscillator();
    const droneGain = this.ctx.createGain();
    droneOsc.type = 'sine';
    droneOsc.frequency.value = droneFreq;
    droneGain.gain.value = 0.08;
    droneOsc.connect(droneGain);
    droneGain.connect(this.reverb);
    droneOsc.start();
    this.nodes.push(droneOsc);

    // Schedule melodic notes
    const scheduleAhead = 8; // seconds
    const scheduleInterval = 4;
    let nextNoteTime = this.ctx.currentTime + 0.1;

    const scheduleNotes = () => {
      if (!this.playing) return;

      while (nextNoteTime < this.ctx.currentTime + scheduleAhead) {
        // Pick a random note from scale
        const scaleStep = scale[Math.floor(Math.random() * scale.length)];
        const octave = Math.floor(Math.random() * 2); // 0 or 1 octave up
        const midiNote = baseNote + scaleStep + (octave * 12);
        const freq = this.noteToFreq(midiNote);

        // Vary duration and gain for musicality
        const dur = beatDuration * (Math.random() < 0.3 ? 0.5 : Math.random() < 0.5 ? 1 : 2);
        const gain = 0.05 + Math.random() * 0.1;

        // Oscillator type based on genre mood
        let oscType = 'sine';
        if (config.type === 'jazz' || config.type === 'folk') oscType = 'triangle';
        if (config.type === 'electronic') oscType = 'sawtooth';
        if (config.type === 'baroque') oscType = 'square';

        this.playNote(freq, nextNoteTime, dur, oscType, gain);

        // Occasionally add harmony
        if (Math.random() < 0.3) {
          const harmStep = scale[Math.floor(Math.random() * scale.length)];
          const harmFreq = this.noteToFreq(baseNote + harmStep);
          this.playNote(harmFreq, nextNoteTime, dur * 1.5, 'sine', gain * 0.6);
        }

        // Advance time - rest probability for breathing room
        const rest = Math.random() < 0.25 ? beatDuration * 0.5 : 0;
        nextNoteTime += beatDuration * (Math.random() < 0.5 ? 0.5 : 1) + rest;
      }

      // Reschedule
      if (this.playing) {
        this.scheduleTimer = setTimeout(scheduleNotes, scheduleInterval * 1000);
      }
    };

    scheduleNotes();
  }

  setVolume(vol) {
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.1);
    }
  }

  stop() {
    this.playing = false;
    clearTimeout(this.scheduleTimer);
    this.nodes.forEach(n => { try { n.stop(); } catch(e) {} });
    this.nodes = [];
  }

  pause() {
    if (this.ctx) this.ctx.suspend();
  }

  resume() {
    if (this.ctx) this.ctx.resume();
  }

  cleanup() {
    this.stop();
    if (this.ctx) { this.ctx.close(); this.ctx = null; }
  }
}

// Singleton engine
const engine = new AmbientMusicEngine();

export default function MusicPlayer() {
  const { playlist, currentTrack, currentTrackIndex, isPlaying, volume, setVolume, togglePlay, nextTrack, prevTrack } = useMusic();
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);
  const prevGenreRef = useRef(null);
  const prevPlayingRef = useRef(false);

  // Handle play/pause/genre changes
  useEffect(() => {
    const genreChanged = prevGenreRef.current !== playlist.name;
    prevGenreRef.current = playlist.name;

    if (isPlaying) {
      if (genreChanged) {
        engine.stop();
        engine.startMusic(playlist.audioConfig, volume);
      } else if (!prevPlayingRef.current) {
        // Resuming
        if (engine.ctx) {
          engine.resume();
        } else {
          engine.startMusic(playlist.audioConfig, volume);
        }
      }
      // Start timer
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    } else {
      engine.pause();
      clearInterval(timerRef.current);
    }

    prevPlayingRef.current = isPlaying;
    return () => clearInterval(timerRef.current);
  }, [isPlaying, playlist]);

  // Volume changes
  useEffect(() => {
    engine.setVolume(volume);
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => engine.cleanup();
  }, []);

  const fmt = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <div className="music-player">
      <div className="player-bar">
        <div className="player-genre-dot" style={{ background: playlist.color }}>{playlist.emoji}</div>

        <div className="player-info">
          <div className="player-track-name">
            {isPlaying ? `♪ ${currentTrack?.title}` : (currentTrack?.title || 'Select a genre on Music page')}
          </div>
          <div className="player-artist">
            {isPlaying ? 'Ambient music — generated live' : currentTrack?.artist || ''}
          </div>
        </div>

        {/* Live timer */}
        <div className="player-progress-wrap">
          <div className="player-progress-bg">
            <div className={`player-progress-fill ${isPlaying ? 'playing-pulse' : ''}`} style={{ width: isPlaying ? '100%' : '0%' }} />
          </div>
          <div className="player-time">{isPlaying ? `▶ ${fmt(time)}` : '⏹ Stopped'}</div>
        </div>

        <div className="player-controls">
          <button className="ctrl-btn" onClick={prevTrack}>⏮</button>
          <button className={`ctrl-btn play-btn ${isPlaying ? 'playing' : ''}`} onClick={togglePlay}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className="ctrl-btn" onClick={nextTrack}>⏭</button>
        </div>

        <div className="player-volume">
          <span>{volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}</span>
          <input type="range" min="0" max="1" step="0.05" value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))} className="volume-slider" />
        </div>

        <div className="track-dots">
          {playlist.tracks.map((_, i) => (
            <span key={i} className={`track-dot ${i === currentTrackIndex ? 'active' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
