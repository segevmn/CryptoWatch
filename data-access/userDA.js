const User = require('../models/user');

async function findUserByEmail(email) {
  return await User.findOne({ email });
}

async function createNewUser(userData) {
  const user = new User(userData);
  return await user.save();
}

async function deleteUserById(userId) {
  return await User.deleteOne({ _id: userId });
}

module.exports = {
  findUserByEmail,
  createNewUser,
  deleteUserById,
};
