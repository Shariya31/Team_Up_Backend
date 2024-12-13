import express from 'express'
import { forgotPassword, resetPassword, userLogin, userRegister } from '../controllers/authController.js';
import { isAuthenticated } from '../middlewares/auth.js';

const app = express.Router();

app.post('/register', userRegister)
app.post('/login',userLogin)
app.post('/password/forgot', forgotPassword);
app.put('/password/reset', resetPassword);

export default app