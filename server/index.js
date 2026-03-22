const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const chatRoutes = require('./routes/chat');
const bookRoutes = require('./routes/books');
const moodRoutes = require('./routes/moods');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bibliotherapy';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('⚠️  MongoDB error:', err.message));

// Routes
app.use('/api/auth',  authRoutes);
app.use('/api/chat',  chatRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/moods', moodRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bibliotherapy API running 📚', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌿 Bibliotherapy server running on port ${PORT}`);
});
