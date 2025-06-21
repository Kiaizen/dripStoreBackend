const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createUser = async (data) => {
  return await User.create(data);
};

const getUserById = async (id) => {
  return await User.findByPk(id);
};

const updateUser = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.update(data);
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) return false;
  await user.destroy();
  return true;
};

const authenticateUser = async (email, password) => {
  const user = await User.findOne({ where: { email, password } });
  if (!user) return null;
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
};

module.exports = {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  authenticateUser
};