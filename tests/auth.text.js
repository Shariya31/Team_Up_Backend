import request from 'supertest';
import app from '../index.js'; // Ensure this is the entry point of your app
import mongoose from 'mongoose';

afterAll(async () => {
    await mongoose.connection.close();
});

describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
        const res = await request(app).post('/api/v1/auth/register').send({
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'password123',
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body.userData).toHaveProperty('email', 'testuser@example.com');
    });
});
