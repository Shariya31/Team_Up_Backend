import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app.js'; // Adjust the path to your app.js
import Task from '../../models/Task.js';
import User from '../../models/User.js';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

describe('Task Controllers', () => {
    let user;
    let token;
    let createdTask;

    beforeAll(async () => {
        // Connect to the test database
        const dbUri = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/TeamUp_test';
        await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });

        // Create a test user
        user = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
        });

        // Mock token
        token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
    });

    afterAll(async () => {
        // Clean up the database
        await User.deleteMany({});
        await Task.deleteMany({});
        await mongoose.connection.close();
    });

    describe('POST /api/tasks (createTask)', () => {
        it('should create a new task successfully', async () => {
            const taskData = {
                title: 'New Task',
                description: 'This is a new task.',
                status: 'Pending',
                dueDate: '2024-12-31',
                assignedTo: user.id,
            };

            const response = await request(app)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${token}`)
                .send(taskData);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('new task created successfully');
            expect(response.body.newTask).toHaveProperty('_id');
            expect(response.body.newTask.title).toBe(taskData.title);

            createdTask = response.body.newTask; // Save the task for the next test
        });

        it('should return an error if required fields are missing', async () => {
            const taskData = {
                description: 'This task has no title.',
            };

            const response = await request(app)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${token}`)
                .send(taskData);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Please fill all the fields');
        });
    });

    describe('GET /api/tasks (getAllTasks)', () => {
        it('should fetch all tasks created by the user', async () => {
            const response = await request(app)
                .get('/api/tasks')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('All tasks fetched');
            expect(response.body.tasks.length).toBeGreaterThan(0);
            expect(response.body.tasks[0]._id).toBe(createdTask._id);
        });

        it('should return 404 if no tasks are found', async () => {
            // Remove all tasks for this test
            const deletedTask = await Task.deleteMany({createdBy: user._id});
            console.log(deletedTask)

            const response = await request(app)
                .get('/api/tasks')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('No tasks found');
        });

        it('should return 401 if the user is not authenticated', async () => {
            const response = await request(app)
                .get('/api/tasks');

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Not Authenticated | No token found');
        });
    });
});
