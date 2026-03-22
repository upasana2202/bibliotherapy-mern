import React, { createContext, useContext, useState } from 'react';

const MusicContext = createContext();

// Genre definitions - music is generated via Web Audio API (no external URLs needed)
export const GENRE_PLAYLISTS = {
  default: {
    name: "Reading Ambience",
    description: "Gentle ambient sounds for quiet reading",
    color: "#6EE7B7",
    emoji: "🌿",
    audioConfig: { type: 'ambient', baseFreq: 220, tempo: 60, mood: 'peaceful' },
    tracks: [
      { title: "Forest Rain Ambience", artist: "Generated", duration: "∞" },
      { title: "Soft Wind Tones", artist: "Generated", duration: "∞" },
    ]
  },
  romance: {
    name: "Romance & Love Stories",
    description: "Tender piano and soft strings for love stories",
    color: "#F472B6",
    emoji: "💕",
    audioConfig: { type: 'piano', baseFreq: 261.63, tempo: 72, mood: 'tender' },
    tracks: [
      { title: "Tender Piano Melody", artist: "Generated", duration: "∞" },
      { title: "Soft String Waltz", artist: "Generated", duration: "∞" },
    ]
  },
  mystery: {
    name: "Mystery & Thriller",
    description: "Jazz noir for detective stories and suspense",
    color: "#374151",
    emoji: "🕵️",
    audioConfig: { type: 'jazz', baseFreq: 174.61, tempo: 80, mood: 'noir' },
    tracks: [
      { title: "Midnight Jazz Club", artist: "Generated", duration: "∞" },
      { title: "Rainy Detective Noir", artist: "Generated", duration: "∞" },
    ]
  },
  fantasy: {
    name: "Fantasy & Magic",
    description: "Ethereal soundscapes for epic adventures",
    color: "#A78BFA",
    emoji: "🧙",
    audioConfig: { type: 'ethereal', baseFreq: 196, tempo: 55, mood: 'magical' },
    tracks: [
      { title: "Enchanted Forest", artist: "Generated", duration: "∞" },
      { title: "Elven Melody", artist: "Generated", duration: "∞" },
    ]
  },
  scifi: {
    name: "Science Fiction",
    description: "Electronic ambience for space and future worlds",
    color: "#06B6D4",
    emoji: "🚀",
    audioConfig: { type: 'electronic', baseFreq: 110, tempo: 90, mood: 'cosmic' },
    tracks: [
      { title: "Deep Space Drift", artist: "Generated", duration: "∞" },
      { title: "Synthwave Cosmos", artist: "Generated", duration: "∞" },
    ]
  },
  literary: {
    name: "Literary Fiction",
    description: "Classical piano for thoughtful, lyrical prose",
    color: "#D97706",
    emoji: "📖",
    audioConfig: { type: 'classical', baseFreq: 246.94, tempo: 65, mood: 'thoughtful' },
    tracks: [
      { title: "Afternoon Piano", artist: "Generated", duration: "∞" },
      { title: "Literary Reverie", artist: "Generated", duration: "∞" },
    ]
  },
  selfhelp: {
    name: "Self-Help & Growth",
    description: "Uplifting acoustic for personal transformation",
    color: "#34D399",
    emoji: "🌱",
    audioConfig: { type: 'uplifting', baseFreq: 293.66, tempo: 85, mood: 'positive' },
    tracks: [
      { title: "Morning Motivation", artist: "Generated", duration: "∞" },
      { title: "Growth & Energy", artist: "Generated", duration: "∞" },
    ]
  },
  memoir: {
    name: "Memoir & Biography",
    description: "Folk and acoustic for personal stories",
    color: "#F59E0B",
    emoji: "📝",
    audioConfig: { type: 'folk', baseFreq: 220, tempo: 70, mood: 'nostalgic' },
    tracks: [
      { title: "Acoustic Memories", artist: "Generated", duration: "∞" },
      { title: "Folk Story", artist: "Generated", duration: "∞" },
    ]
  },
  poetry: {
    name: "Poetry & Verse",
    description: "Minimal piano for introspective verse",
    color: "#C084FC",
    emoji: "✍️",
    audioConfig: { type: 'minimal', baseFreq: 164.81, tempo: 50, mood: 'introspective' },
    tracks: [
      { title: "Quiet Verse", artist: "Generated", duration: "∞" },
      { title: "Meditation Tones", artist: "Generated", duration: "∞" },
    ]
  },
  historical: {
    name: "Historical Fiction",
    description: "Baroque and classical for journeys through time",
    color: "#92400E",
    emoji: "🏛️",
    audioConfig: { type: 'baroque', baseFreq: 196, tempo: 75, mood: 'dignified' },
    tracks: [
      { title: "Baroque Chamber", artist: "Generated", duration: "∞" },
      { title: "Ancient Echoes", artist: "Generated", duration: "∞" },
    ]
  }
};

export function MusicProvider({ children }) {
  const [currentGenre, setCurrentGenre] = useState('default');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.4);

  const playlist = GENRE_PLAYLISTS[currentGenre] || GENRE_PLAYLISTS.default;
  const currentTrack = playlist.tracks[currentTrackIndex];

  const selectGenre = (genre) => {
    setCurrentGenre(genre);
    setCurrentTrackIndex(0);
    setIsPlaying(true);
  };

  const togglePlay = () => setIsPlaying(p => !p);
  const nextTrack = () => setCurrentTrackIndex(i => (i + 1) % playlist.tracks.length);
  const prevTrack = () => setCurrentTrackIndex(i => (i - 1 + playlist.tracks.length) % playlist.tracks.length);

  return (
    <MusicContext.Provider value={{
      currentGenre, playlist, currentTrack, currentTrackIndex,
      isPlaying, volume, setVolume, selectGenre, togglePlay, nextTrack, prevTrack,
      GENRE_PLAYLISTS
    }}>
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => useContext(MusicContext);
