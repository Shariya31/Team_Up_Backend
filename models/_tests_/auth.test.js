import request from 'supertest';
import app from '../../app.js';
import mongoose from 'mongoose';
import User from '../User.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Authentication API Tests', () => {
  let server;

  beforeAll(() => {
    // Start the server before running tests
    server = app.listen();
  });

  afterAll(async () => {
    // Cleanup: Close server and database connection
    await mongoose.connection.close();
    server.close();
  });

  // Clear users in the database after each test
  afterEach(async () => {
    await User.deleteMany();
  });

  const testUser = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: 'Test@1234',
  };

  // Test: User Registration
  it('should register a new user successfully', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'User is created successfully');
    expect(res.body.newUser).toHaveProperty('email', testUser.email);
  });

  // Test: User Registration - Missing Fields
  it('should fail if any required field is missing', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: testUser.email,
      password: testUser.password, // Missing 'name'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Please fill all the fields');
  });

  // Test: User Registration - User Already Exists
  it('should fail if user already exists', async () => {
    await User.create(testUser); // Pre-create the user

    const res = await request(app).post('/api/auth/register').send(testUser);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'User already exists | Try to login'
    );
  });

  // Test: User Login - Successful Login
  it('should log in a user successfully', async () => {
    // First, create a user
    await User.create(testUser);

    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'Login Successful | Welcome John Doe');
    expect(res.body).toHaveProperty('token');
  });

  // Test: User Login - Invalid Credentials
  it('should fail with incorrect password', async () => {
    // First, create a user
    await User.create(testUser);

    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: 'WrongPassword123',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Password is not correct');
  });

  // Test: User Login - User Not Found
  it('should fail if user does not exist', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nonexistent@example.com',
      password: 'Test@1234',
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'No user found with this email');
  });

  // Test: User Login - Missing Fields
  it('should fail if required fields are missing in login', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email, // Missing password
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Please fill all the fields');
  });
});
