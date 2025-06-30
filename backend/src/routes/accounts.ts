import { Router, Request, Response } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validation';
import { Account } from '@/models/Account';
import { ApiResponse } from '@/types';

const router = Router();

// Get user's accounts
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    
    const accounts = await Account.find({
      'members.userId': userId
    }).populate('ownerId', 'name email');

    res.json({
      success: true,
      data: accounts
    } as ApiResponse);

  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get accounts'
    } as ApiResponse);
  }
});

// Create account
router.post('/', [
  authenticate,
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('type').isIn(['personal', 'family']).withMessage('Type must be personal or family'),
  validateRequest
], async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const userName = (req as any).user.name;
    const { name, type } = req.body;

    const account = new Account({
      name,
      type,
      ownerId: userId,
      members: [{
        userId,
        role: 'admin',
        name: userName,
        joinedAt: new Date()
      }]
    });

    await account.save();

    res.status(201).json({
      success: true,
      data: account
    } as ApiResponse);

  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create account'
    } as ApiResponse);
  }
});

// Get account by ID
router.get('/:id', [
  authenticate,
  param('id').isMongoId().withMessage('Invalid account ID'),
  validateRequest
], async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const accountId = req.params.id;

    const account = await Account.findOne({
      _id: accountId,
      'members.userId': userId
    }).populate('ownerId', 'name email');

    if (!account) {
      res.status(404).json({
        success: false,
        error: 'Account not found'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: account
    } as ApiResponse);

  } catch (error) {
    console.error('Get account error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get account'
    } as ApiResponse);
  }
});

export default router;