import express from 'express';
import { signup, login, enable2FA, verify2FA } from '../controllers/authController.js';

const router = express.Router();

// Define routes and map them to controller functions
router.post('/signup', signup);          // Signup route
router.post('/login', login);            // Login route
router.post('/enable-2fa', enable2FA);   // Enable 2FA route
router.post('/verify-2fa', verify2FA);   // Verify 2FA route

export default router;
