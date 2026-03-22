const express = require('express');
const router = express.Router();
const { getBooks, getBookById, getMoods, getGenres, getStats, getRecommendations } = require('../controllers/bookController');

router.get('/stats',           getStats);
router.get('/moods',           getMoods);
router.get('/genres',          getGenres);
router.get('/recommendations', getRecommendations);
router.get('/',                getBooks);
router.get('/:id',             getBookById);

module.exports = router;