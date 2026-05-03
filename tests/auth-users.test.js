const request = require('supertest');
const app = require('../src/app');
const { resetDatabaseForTests } = require('../src/config/db');

beforeEach(() => {
  resetDatabaseForTests();
});

async function registerUser(overrides = {}) {
  const payload = {
    fullName: 'User Test',
    birthDate: '1995-05-20',
    email: `user${Date.now()}${Math.random()}@test.com`,
    password: '123456',
    role: 'user',
    ...overrides
  };

  const response = await request(app).post('/api/auth/register').send(payload);
  return { response, payload };
}

describe('Auth', () => {
  test('registers user and returns token', async () => {
    const { response } = await registerUser({ email: 'user@test.com' });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
    expect(response.body.data.user.passwordHash).toBeUndefined();
  });

  test('does not allow duplicate email', async () => {
    await registerUser({ email: 'duplicate@test.com' });
    const { response } = await registerUser({ email: 'duplicate@test.com' });

    expect(response.status).toBe(409);
  });

  test('logs in active user', async () => {
    await registerUser({ email: 'login@test.com', password: '123456' });

    const response = await request(app).post('/api/auth/login').send({
      email: 'login@test.com',
      password: '123456'
    });

    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeDefined();
  });
});

describe('Users permissions', () => {
  test('admin can get users list', async () => {
    const { response: admin } = await registerUser({
      fullName: 'Admin Test',
      email: 'admin@test.com',
      role: 'admin'
    });

    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${admin.body.data.token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('regular user cannot get users list', async () => {
    const { response: user } = await registerUser({ email: 'regular@test.com' });

    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${user.body.data.token}`);

    expect(response.status).toBe(403);
  });

  test('regular user can get only own profile', async () => {
    const { response: first } = await registerUser({ email: 'first@test.com' });
    const { response: second } = await registerUser({ email: 'second@test.com' });

    const ownId = first.body.data.user.id;
    const anotherId = second.body.data.user.id;

    const ownResponse = await request(app)
      .get(`/api/users/${ownId}`)
      .set('Authorization', `Bearer ${first.body.data.token}`);

    const forbiddenResponse = await request(app)
      .get(`/api/users/${anotherId}`)
      .set('Authorization', `Bearer ${first.body.data.token}`);

    expect(ownResponse.status).toBe(200);
    expect(forbiddenResponse.status).toBe(403);
  });

  test('user can block self and cannot login after block', async () => {
    const { response: user } = await registerUser({
      email: 'blockme@test.com',
      password: '123456'
    });

    const id = user.body.data.user.id;
    const token = user.body.data.token;

    const blockResponse = await request(app)
      .patch(`/api/users/${id}/block`)
      .set('Authorization', `Bearer ${token}`);

    expect(blockResponse.status).toBe(200);
    expect(blockResponse.body.data.isActive).toBe(0);

    const loginResponse = await request(app).post('/api/auth/login').send({
      email: 'blockme@test.com',
      password: '123456'
    });

    expect(loginResponse.status).toBe(403);
  });
});
