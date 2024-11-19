import express from 'express'
import {forgotPassword, getUserProfile, resetPassword } from '../controllers/user.js';
import { protect } from '../middlewares/auth.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import { deleteUser, getAdminLogs, getAllUsers, updateUserRole } from '../controllers/admin.js';

const app = express.Router();

http://localhost:5000/api/v1/user/profile
app.get('/profile',protect, getUserProfile)

http://localhost:5000/api/v1/user/password/forgot
app.post('/password/forgot', forgotPassword);

http://localhost:5000/api/v1/user/password/reset/:token
app.put('/password/reset/:token', resetPassword);

http://localhost:5000/api/v1/user/admin/users
app.get('/admin/users', protect, authorize('admin'), getAllUsers)

http://localhost:5000/api/v1/user/admin/users/id
app.route('/admin/users/:id').delete(protect, authorize('admin'), deleteUser).put(protect, authorize('admin'), updateUserRole)

http://localhost:5000/api/v1/user/admin/logs
app.get('/admin/logs', protect, authorize('admin'), getAdminLogs)

export default app