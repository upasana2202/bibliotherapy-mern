import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MusicProvider } from './context/MusicContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import MusicPlayer from './components/MusicPlayer';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import LibraryPage from './pages/LibraryPage';
import MusicPage from './pages/MusicPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <MusicProvider>
        <Router>
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/"        element={<HomePage />} />
              <Route path="/chat"    element={<ChatPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/music"   element={<MusicPage />} />
              <Route path="/auth"    element={<AuthPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>
          <MusicPlayer />
        </Router>
      </MusicProvider>
    </AuthProvider>
  );
}
