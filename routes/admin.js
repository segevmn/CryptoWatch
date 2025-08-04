/**
 * admin.js
 * Express router for handling admin routes.
 * Maps HTTP endpoints to controller methods.
 */

const express = require('express');

const adminController = require('../controllers/adminController');
const { isAuth } = require('../middleware/is-auth');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

/**
 * DELETE /users/:id
 * Deletes a user by ID (admin only).
 */
router.delete(
  '/users/:id',
  isAuth,
  requireRole('admin'),
  adminController.deleteUser
);
