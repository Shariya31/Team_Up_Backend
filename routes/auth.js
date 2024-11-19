import express from 'express'
import {registerUser, userLogIn } from '../controllers/auth.js';

const app = express.Router();

// http://localhost:5000/api/v1/autn/login
app.post('/login', userLogIn)

// http://localhost:5000/api/v1/auth/register
app.post('/register', registerUser)

export default app;