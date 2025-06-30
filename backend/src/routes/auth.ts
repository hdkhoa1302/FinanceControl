import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getProfile, updateCurrentAccount } from '@/controllers/authController';
import { authenticate } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validation';

const router = Router();

// Register validation
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
];

// Login validation
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.get('/profile', authenticate, getProfile);
router.patch(
  '/account',
  authenticate,
  body('accountId').isMongoId().withMessage('Invalid account ID'),
  validateRequest,
  updateCurrentAccount
);

export default router;