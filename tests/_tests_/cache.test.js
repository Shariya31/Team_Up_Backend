import request from 'supertest';
import app from '../../index.js';  // Your app entry point
import { setCache, getCache } from '../../Utilities/cache.js';  // Import cache utility functions

jest.mock('../../Utilities/cache.js');  // Mock the cache functions

describe('GET /users', () => {
    it('should return cached user data if available', async () => {
        const mockUsers = [
            { name: 'John Doe', email: 'john@example.com' },
            { name: 'Jane Doe', email: 'jane@example.com' },
        ];

        // Mock cache response
        getCache.mockReturnValue(mockUsers);

        const res = await request(app).get('/users');

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.users).toEqual(mockUsers);
        expect(getCache).toHaveBeenCalledWith('all_users');  // Check if cache was called
    });

    it('should fetch user data from DB if not in cache', async () => {
        const mockUsersFromDb = [
            { name: 'Alice', email: 'alice@example.com' },
            { name: 'Bob', email: 'bob@example.com' },
        ];

        // Mock getCache to return null (no data in cache)
        getCache.mockReturnValue(null);

        // Mock setCache to avoid actually writing to cache in tests
        setCache.mockImplementation(() => {});

        const res = await request(app).get('/users');

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.users).toEqual(mockUsersFromDb);
        expect(getCache).toHaveBeenCalledWith('all_users');  // Check if cache was called
        expect(setCache).toHaveBeenCalledWith('all_users', mockUsersFromDb);  // Check if data was cached
    });
});
