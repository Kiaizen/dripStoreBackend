const express = require('express');
const app = express();
const sequelize = require('./config/database.js');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());

// Exemplo de rota protegida
const userRoutes = require('./routes/userRoutes');
app.use('/v1', userRoutes);

const categoryRoutes = require('./routes/categoryRoutes');
app.use('/v1', categoryRoutes);

const productRoutes = require('./routes/productRoutes.js')
app.use('/v1',productRoutes)

const authRoutes = require('./routes/authRoutes');
app.use('/v1',authRoutes);

// Conectar com banco
sequelize.authenticate()
  .then(() => console.log('Conectado ao banco!'))
  .catch(err => console.error('Erro na conexão com banco:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

module.exports = app;