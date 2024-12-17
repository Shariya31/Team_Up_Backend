import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app.js'; // Your app's entry file
import User from '../User.js';
import dotevn from 'dotenv'
import bcrypt from 'bcrypt'

dotevn.config()
// Mock environment variables
process.env.JWT_SECRET
process.env.MONGO_URI

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterEach(async () => {
    // Clear the database after each test
    await User.deleteMany({});
});

afterAll(async () => {
    // Disconnect the database
    await mongoose.disconnect();
});

// Test suite for registerUser
describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('User is created successfully');
        expect(res.body.newUser).toHaveProperty('_id');
        expect(res.body.newUser).toHaveProperty('email', 'john@example.com');
    });

    it('should not register a user without required fields', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'missingfields@example.com' });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Please fill all the fields');
    });

    it('should not register a user if email already exists', async () => {
        await User.create({
            name: 'Jane Doe',
            email: 'jane@example.com',
            password: 'password123',
        });

        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Jane Doe',
                email: 'jane@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('User already exists | Try to login');
    });
});

// Test suite for loginUser
describe('POST /api/auth/login', () => {
    beforeEach(async () => {
        // Create a user in the test database
        // const passwordHash = await bcrypt.hash('password123', 10);
        await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
        });
    });

    it('should login successfully with correct credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'john@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toContain('Login Successful');
        expect(res.body).toHaveProperty('token');
    });

    it('should not login with incorrect password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'john@example.com',
                password: 'wrongpassword',
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Password is not correct');
    });

    it('should not login if email is not registered', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'unknown@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('No user found with this email');
    });

    it('should not login without required fields', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'john@example.com' });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Please fill all the fields');
    });
});
