import bcrypt from 'bcrypt';
import speakeasy from 'speakeasy';
import { generateQRCode } from '../utils/generateQrCode.js';  
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: User signup
 *     description: Creates a new user with username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       201:
 *         description: Signup successful
 *       400:
 *         description: Missing username or password
 *       500:
 *         description: Server error
 */
const validatePassword = (password) => {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[@$!%*?&]/.test(password)
  };

  const missingRequirements = [];
  if (!requirements.minLength) missingRequirements.push("at least 8 characters");
  if (!requirements.hasUpperCase) missingRequirements.push("an uppercase letter");
  if (!requirements.hasLowerCase) missingRequirements.push("a lowercase letter");
  if (!requirements.hasNumber) missingRequirements.push("a number");
  if (!requirements.hasSpecialChar) missingRequirements.push("a special character (@$!%*?&)");

  return {
    isValid: Object.values(requirements).every(Boolean),
    missingRequirements
  };
};

export const signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Missing username or password.' });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        message: 'Password requirements not met.',
        missing: `Your password needs: ${passwordValidation.missingRequirements.join(', ')}`
      });
    }
    
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashedPassword },
    });

    res.status(201).json({ message: 'Signup successful.', user });
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};


/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     description: Logs in the user with username and password, checking if 2FA is enabled.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Missing username or password
 *       401:
 *         description: Invalid username or password
 *       500:
 *         description: Server error
 */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Missing username or password.' });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    res.status(200).json({ message: 'Login successful.', twoFactorEnabled: user.twoFactorEnabled });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * @swagger
 * /api/enable-2fa:
 *   post:
 *     summary: Enable 2FA for a user
 *     description: Enables 2FA for a user and generates a QR code.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *             required:
 *               - username
 *     responses:
 *       200:
 *         description: 2FA enabled successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
export const enable2FA = async (req, res) => {
  try {
    const { username } = req.body;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const secret = speakeasy.generateSecret({ name: `YourAppName (${username})` });
    const qrCode = await generateQRCode(secret.otpauth_url);

    await prisma.user.update({
      where: { username },
      data: { twoFactorSecret: secret.base32, twoFactorEnabled: true },
    });

    res.status(200).json({ message: '2FA enabled.', qrCode });
  } catch (error) {
    console.error('Error enabling 2FA:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * @swagger
 * /api/verify-2fa:
 *   post:
 *     summary: Verify 2FA code
 *     description: Verifies the 2FA code entered by the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               token:
 *                 type: string
 *             required:
 *               - username
 *               - token
 *     responses:
 *       200:
 *         description: Authentication successful
 *       401:
 *         description: Invalid 2FA code
 *       500:
 *         description: Server error
 */
export const verify2FA = async (req, res) => {
  try {
    const { username, token } = req.body;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
    });

    if (!verified) {
      return res.status(401).json({ message: 'Invalid 2FA code.' });
    }

    res.status(200).json({ message: 'Authentication successful.' });
  } catch (error) {
    console.error('Error verifying 2FA:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
