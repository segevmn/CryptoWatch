const express = require('express');

const userController = require('../controllers/user');
const { isAuth } = require('../middleware/is-auth');

const router = express.Router();

router.get('/watchlist', isAuth, userController.getWatchlist);

module.exports = router;
