import express from 'express';
import { signup, login, enable2FA, verify2FA } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);        
router.post('/login', login);            
router.post('/enable-2fa', enable2FA);   
router.post('/verify-2fa', verify2FA);   

export default router;
