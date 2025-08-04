/**
 * authService.js
 * Service for handling user authentication operations.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { getEnvVar } = require('../config');
const userDataAccess = require('../data-access/userDA');

const JWT_SECRET = getEnvVar('JWT_SECRET');

const authService = {
  register: async (email, password) => {
    const existingUser = await userDataAccess.findUserByEmail(email);
    if (existingUser) throw new Error('User already exists');

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
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

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
