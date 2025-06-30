import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validation';
import { Wallet } from '@/models/Wallet';
import { Account } from '@/models/Account';
import { ApiResponse } from '@/types';

const router = Router();

// Get wallets by account
router.get('/', [
  authenticate,
  query('accountId').isMongoId().withMessage('Invalid account ID'),
  validateRequest
], async (req, res) => {
  try {
    const userId = (req as any).user._id;
    const accountId = req.query.accountId as string;

    // Verify user has access to account
    const account = await Account.findOne({
      _id: accountId,
      'members.userId': userId
    });

    if (!account) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this account'
      } as ApiResponse);
    }

    const wallets = await Wallet.find({ accountId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: wallets
    } as ApiResponse);

  } catch (error) {
    console.error('Get wallets error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get wallets'
    } as ApiResponse);
  }
});

// Create wallet
router.post('/', [
  authenticate,
  body('accountId').isMongoId().withMessage('Invalid account ID'),
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('type').isIn(['cash', 'bank', 'e-wallet']).withMessage('Invalid wallet type'),
  body('balance').isNumeric().isFloat({ min: 0 }).withMessage('Balance must be a positive number'),
  body('currency').optional().isIn(['VND', 'USD', 'EUR']).withMessage('Invalid currency'),
  body('bankInfo').optional().trim().isLength({ max: 200 }).withMessage('Bank info cannot exceed 200 characters'),
  body('color').optional().isHexColor().withMessage('Invalid color format'),
  validateRequest
], async (req, res) => {
  try {
    const userId = (req as any).user._id;
    const { accountId, name, type, balance, currency, bankInfo, color } = req.body;

    // Verify user has access to account
    const account = await Account.findOne({
      _id: accountId,
      'members.userId': userId
    });

    if (!account) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this account'
      } as ApiResponse);
    }

    const wallet = new Wallet({
      accountId,
      name,
      type,
      balance: balance || 0,
      currency: currency || 'VND',
      bankInfo,
      color: color || '#3B82F6'
    });

    await wallet.save();

    res.status(201).json({
      success: true,
      data: wallet
    } as ApiResponse);

  } catch (error) {
    console.error('Create wallet error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create wallet'
    } as ApiResponse);
  }
});

// Update wallet
router.put('/:id', [
  authenticate,
  param('id').isMongoId().withMessage('Invalid wallet ID'),
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('bankInfo').optional().trim().isLength({ max: 200 }).withMessage('Bank info cannot exceed 200 characters'),
  body('color').optional().isHexColor().withMessage('Invalid color format'),
  validateRequest
], async (req, res) => {
  try {
    const userId = (req as any).user._id;
    const walletId = req.params.id;
    const updates = req.body;

    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
      return res.status(404).json({
        success: false,
        error: 'Wallet not found'
      } as ApiResponse);
    }

    // Verify user has access to account
    const account = await Account.findOne({
      _id: wallet.accountId,
      'members.userId': userId
    });

    if (!account) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this wallet'
      } as ApiResponse);
    }

    Object.assign(wallet, updates);
    await wallet.save();

    res.json({
      success: true,
      data: wallet
    } as ApiResponse);

  } catch (error) {
    console.error('Update wallet error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update wallet'
    } as ApiResponse);
  }
});

// Delete wallet
router.delete('/:id', [
  authenticate,
  param('id').isMongoId().withMessage('Invalid wallet ID'),
  validateRequest
], async (req, res) => {
  try {
    const userId = (req as any).user._id;
    const walletId = req.params.id;

    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
      return res.status(404).json({
        success: false,
        error: 'Wallet not found'
      } as ApiResponse);
    }

    // Verify user has access to account
    const account = await Account.findOne({
      _id: wallet.accountId,
      'members.userId': userId
    });

    if (!account) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this wallet'
      } as ApiResponse);
    }

    // Check if wallet has zero balance
    if (wallet.balance !== 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete wallet with non-zero balance'
      } as ApiResponse);
    }

    await Wallet.findByIdAndDelete(walletId);

    res.json({
      success: true,
      message: 'Wallet deleted successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Delete wallet error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete wallet'
    } as ApiResponse);
  }
});

export default router;