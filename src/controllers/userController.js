const userService = require('../services/userService');

const createUser = async (req, res) => {
  try {
    const result = await userService.create(req.body);
    return res.status(201).send(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getById(req.params.id);
    if (!user) return res.status(404).send('Usuário não encontrado');
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updated = await userService.update(req.params.id, req.body);
    if (!updated) return res.status(404).send();
    return res.status(204).send();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleted = await userService.remove(req.params.id);
    if (!deleted) return res.status(404).send();
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const generateToken = async (req, res) => {
  try {
    const token = await userService.login(req.body);
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  generateToken
};
