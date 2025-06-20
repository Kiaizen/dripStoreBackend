const User = require('../models/User');
const bcrypt = require('bcrypt');

// ✅ Função para buscar usuário por ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      attributes: ['id', 'firstname', 'surname', 'email']
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar usuário', error });
  }
};

// ✅ Função para cadastrar novo usuário
const createUser = async (req, res) => {
  const { firstname, surname, email, password, confirmPassword } = req.body;

  if (!firstname || !surname || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'As senhas não coincidem.' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já está em uso.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstname,
      surname,
      email,
      password: hashedPassword
    });

    return res.status(201).json({
      id: newUser.id,
      firstname: newUser.firstname,
      surname: newUser.surname,
      email: newUser.email
    });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao cadastrar usuário' });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstname, surname, email } = req.body;

  // Validação básica dos campos
  if (!firstname || !surname || !email) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    await user.update({ firstname, surname, email });

    return res.status(204).send(); // No Content, sem corpo
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    await user.destroy();

    return res.status(204).send(); // No Content
  } catch (err) {
    console.error('Erro ao deletar usuário:', err);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

module.exports = {
  getUserById,
  createUser,
  updateUser,
  deleteUser
};