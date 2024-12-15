import request from 'supertest';
import app from '../../app.js';

describe('Sample Test', () => {
    it('should return a success message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Servers is working!');
    });
});
