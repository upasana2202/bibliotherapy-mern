const express = require('express');
const router = express.Router();
const { getMoods } = require('../controllers/bookController');

router.get('/', getMoods); // GET /api/moods

module.exports = router;
