const app = require('./app');
const sequelize = require('./config/database');
const models = require('./models');

const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false }) // true recria tabelas — cuidado em produção!
  .then(() => {
    console.log('Banco de dados sincronizado.');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar no banco:', err);
  });
