/**
 * authService.js
 * Service for handling user authentication operations.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { getEnvVar } = require('../config');
const userDataAccess = require('../data-access/userDA');
const {
  createError,
  NotFoundError,
  ValidationError,
} = require('../utils/errors');

const JWT_SECRET = getEnvVar('JWT_SECRET');
const UnauthorizedError = createError('UnauthorizedError', 401);

const authService = {
  register: async (email, password) => {
    const existingUser = await userDataAccess.findUserByEmail(email);
    if (existingUser) throw ValidationError('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userDataAccess.createNewUser({
      email,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    return { user, token };
  },

  login: async (email, password) => {
    const user = await userDataAccess.findUserByEmail(email);
    if (!user) throw NotFoundError('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw UnauthorizedError('Invalid credentials');

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );
    return { user, token };
  },
};

module.exports = authService;
