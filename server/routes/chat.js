const express = require('express');
const router = express.Router();
const { chat, GENRE_MUSIC_MAP } = require('../controllers/chatController');

// POST /api/chat - Send message to Sage (Gemini-powered bibliotherapy guide)
router.post('/', chat);

// GET /api/chat/music-map - Get genre music pairings
router.get('/music-map', (req, res) => {
  res.json(GENRE_MUSIC_MAP);
});

module.exports = router;
