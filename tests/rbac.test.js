const request = require('supertest');
const app = require('../app');
const User = require('../src/models/User');
const mongoose = require('mongoose');

// Sample users for testing
const users = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    password: 'test1234',
    role: 'patient',
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'janesmith@example.com',
    password: 'test5678',
    role: 'doctor',
  },
];

let authTokens = [];

beforeAll(async () => {
    const url = `mongodb://127.0.0.1/test_database`;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    // Register users for testing
    await Promise.all(
        users.map(async (user) => {
        await request(app)
            .post('/api/auth/register')
            .send(user);
        })
    );

    // Login users to get JWT tokens
    await Promise.all(
        users.map(async (user, index) => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
            email: user.email,
            password: user.password,
            });
        
        authTokens[index] = res.body.token;
        })
    );
});

afterAll(async () => {
    // Clean up: delete test users after tests
    await Promise.all(
        users.map(async (user) => {
        await User.deleteOne({ email: user.email });
        })
    );
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe('Role-Based Access Control', () => {
  it('should allow access to patient profile for patient role', async () => {
    const res = await request(app)
      .get('/api/profile/me')
      .set('x-auth-token', authTokens[0]);

    expect(res.statusCode).toEqual(200);
  });

  it('should return 403 for unauthorized access to patient profile by doctor', async () => {
    const res = await request(app)
      .get('/api/profile/me')
      .set('x-auth-token', authTokens[1]);

    expect(res.statusCode).toEqual(403);
    expect(res.body.msg).toEqual('Unauthorized');
  });
});