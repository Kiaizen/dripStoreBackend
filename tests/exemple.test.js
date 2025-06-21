const request = require('supertest');
const app = require('../src/app');

describe('POST /login', () => {
  it('deve retornar 400 se o email for inválido', async () => {
    const res = await request(app)
      .post('/v1/user')
      .send({ email: 'invalido', password: '123' });
    expect(res.statusCode).toBe(400);
  });
});