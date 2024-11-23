import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../index.js'; 

afterAll(async () => {
    await mongoose.connection.close();
});

describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
        const res = await request(app).post('/api/v1/auth/register').send({
            name: 'Test User',
            email: 'testuser1@example.com',
            password: 'password123',
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body.userData).toHaveProperty('email', 'testuser1@example.com');
    });

    it('should fail if email is already taken', async () => {
        const res = await request(app).post('/api/v1/auth/register').send({
            name: 'Test User',
            email: 'testuser1@example.com', // Same email as the previous test
            password: 'password123',
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'User already exists');
    });

    it('should fail if required fields are missing', async () => {
        const res = await request(app).post('/api/v1/auth/register').send({
            name: '', // Empty name
            email: '',
            password: '',
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Please provide all the fields');
    });
});
