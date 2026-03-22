const User = require('../models/User');
const { signToken } = require('../middleware/auth');

// Register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide name, email and password' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered. Please login.' });
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        favourites: user.favourites,
        readingList: user.readingList,
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Incorrect email or password' });
    }

    const token = signToken(user._id);

    res.json({
      message: 'Welcome back!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        favourites: user.favourites,
        readingList: user.readingList,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};

// Get current user
const getMe = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      favourites: req.user.favourites,
      readingList: req.user.readingList,
      createdAt: req.user.createdAt,
    }
  });
};

// Toggle favourite book
const toggleFavourite = async (req, res) => {
  try {
    const bookId = parseInt(req.params.bookId);
    const user = req.user;

    const isFav = user.favourites.includes(bookId);

    if (isFav) {
      user.favourites = user.favourites.filter(id => id !== bookId);
    } else {
      user.favourites.push(bookId);
    }

    await user.save();
    res.json({
      message: isFav ? 'Removed from favourites' : 'Added to favourites',
      favourites: user.favourites,
      isFavourite: !isFav
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not update favourites' });
  }
};

// Update reading list
const updateReadingList = async (req, res) => {
  try {
    const bookId = parseInt(req.params.bookId);
    const { status } = req.body; // 'want' | 'reading' | 'finished' | 'remove'
    const user = req.user;

    if (status === 'remove') {
      user.readingList = user.readingList.filter(item => item.bookId !== bookId);
    } else {
      const existing = user.readingList.find(item => item.bookId === bookId);
      if (existing) {
        existing.status = status;
      } else {
        user.readingList.push({ bookId, status });
      }
    }

    await user.save();
    res.json({
      message: 'Reading list updated',
      readingList: user.readingList
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not update reading list' });
  }
};

// Save chat history
const saveChatHistory = async (req, res) => {
  try {
    const { messages } = req.body;
    const user = req.user;
    user.chatHistory = messages.slice(-50); // keep last 50 messages
    await user.save();
    res.json({ message: 'Chat history saved' });
  } catch (err) {
    res.status(500).json({ error: 'Could not save chat history' });
  }
};

module.exports = { register, login, getMe, toggleFavourite, updateReadingList, saveChatHistory };
