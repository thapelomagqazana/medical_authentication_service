const request = require('supertest');
const mongoose = require('mongoose');
const User = require("../../models/User");
const app = require('../../app');

// Mock MongoDB connection
beforeAll(async () => {
    const url = `mongodb://127.0.0.1/test_database`;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await User.deleteMany();
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});



describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not register a user with duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.errors[0].msg).toEqual('User already exists');
  });
});

describe('POST /api/auth/login', () => {
  it('should login a user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'johndoe@example.com',
        password: 'password',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'johndoe@example.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.errors[0].msg).toEqual('Invalid credentials');
  });
});