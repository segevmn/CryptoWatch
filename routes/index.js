/**
 * index.js
 * Express router for handling routes routes.
 *
 * Maps HTTP endpoints to controller methods.
 */

const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const coinRoutes = require('./coin');
const userRoutes = require('./user');
const adminRoutes = require('./admin');

router.use('/auth', authRoutes);
router.use('/coingecko', coinRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
