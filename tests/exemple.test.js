const request = require('supertest');
const app = require('../src/app'); // ou onde estiver seu app.js
const jwt = require('jsonwebtoken');

// Cria um token válido de teste
const token = jwt.sign({ id: 1, email: 'teste@mail.com' }, process.env.JWT_SECRET);

describe('Testes de autenticação com JWT', () => {
  it('Deve retornar 401 se o token não for enviado', async () => {
    const res = await request(app)
      .post('/v1/category') // rota protegida
      .send({ name: 'Test', slug: 'test' });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Token não enviado');
  });

  it('Deve retornar 401 se o token for inválido', async () => {
    const res = await request(app)
      .post('/v1/category')
      .set('Authorization', 'Bearer tokeninvalido')
      .send({ name: 'Test', slug: 'test' });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Token inválido');
  });

  it('Deve permitir acesso com token válido', async () => {
    const res = await request(app)
      .post('/v1/category')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Categoria Teste',
        slug: 'categoria-teste',
        use_in_menu: true
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});
