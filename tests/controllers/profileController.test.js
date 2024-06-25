const request = require('supertest');
const app = require('../../app');
const User = require('../../src/models/User');
const mongoose = require('mongoose');

// Sample user data for testing
const userData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@example.com',
  password: 'test1234',
};

let authToken;

beforeAll(async () => {
    const url = `mongodb://127.0.0.1/test_database`;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

    // Register a user for testing
    await request(app)
        .post('/api/auth/register')
        .send(userData);

    // Login to get JWT token
    const res = await request(app)
        .post('/api/auth/login')
        .send({
        email: userData.email,
        password: userData.password,
        });
    
    authToken = res.body.token;
});

afterAll(async () => {
    // Clean up: delete test user after tests
    await User.deleteMany();
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe('Profile Management', () => {
  it('should get current user profile', async () => {
    const res = await request(app)
      .get('/api/profile/me')
      .set('x-auth-token', authToken);

    expect(res.statusCode).toEqual(200);
    expect(res.body.firstName).toEqual(userData.firstName);
    expect(res.body.lastName).toEqual(userData.lastName);
    expect(res.body.email).toEqual(userData.email);
    expect(res.body.password).toBeUndefined(); // Ensure password is not returned
  });

  it('should update current user profile', async () => {
    const updatedData = {
      firstName: 'Jane',
      lastName: 'Doe',
      address: '123 Main St',
      phone: '123-456-7890',
    };

    const res = await request(app)
      .post('/api/profile/me')
      .set('x-auth-token', authToken)
      .send(updatedData);

    expect(res.statusCode).toEqual(200);
    expect(res.body.firstName).toEqual(updatedData.firstName);
    expect(res.body.lastName).toEqual(updatedData.lastName);
    expect(res.body.address).toEqual(updatedData.address);
    expect(res.body.phone).toEqual(updatedData.phone);
  });

  it('should return 401 if token is not provided', async () => {
    const res = await request(app)
      .get('/api/profile/me');

    expect(res.statusCode).toEqual(401);
  });

  it('should return 400 if invalid data is provided for update', async () => {
    const invalidData = {
      firstName: '',
      lastName: '',
    };

    const res = await request(app)
      .post('/api/profile/me')
      .set('x-auth-token', authToken)
      .send(invalidData);

    expect(res.statusCode).toEqual(400);
  });
});