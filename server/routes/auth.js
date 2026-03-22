const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  register, login, getMe,
  toggleFavourite, updateReadingList, saveChatHistory
} = require('../controllers/authController');

router.post('/register',                          register);
router.post('/login',                             login);
router.get('/me',               protect,          getMe);
router.post('/favourites/:bookId', protect,       toggleFavourite);
router.post('/reading-list/:bookId', protect,     updateReadingList);
router.post('/chat-history',    protect,          saveChatHistory);

module.exports = router;
