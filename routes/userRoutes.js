import express from 'express'
import { forgotPassword, loginUser, registerUser, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/forgot-passowrd', forgotPassword)
router.put('/reset-passowrd/:token', resetPassword)

export default router