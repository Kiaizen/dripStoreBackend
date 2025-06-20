const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const generateToken = async (req, res) => {
  const { email, password } = req.body;

  // Verifica se os dados foram enviados
  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    // Verifica se o usuário existe e a senha confere
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ token });
  } catch (err) {
    console.error('Erro ao gerar token:', err);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

module.exports = { generateToken };
