import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validation';
import { Transaction } from '@/models/Transaction';
import { Wallet } from '@/models/Wallet';
import { Account } from '@/models/Account';
import { ApiResponse, PaginationQuery, FilterQuery } from '@/types';

const router = Router();

// Get transactions
router.get('/', [
  authenticate,
  query('accountId').isMongoId().withMessage('Invalid account ID'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  validateRequest
], async (req, res) => {
  try {
    const userId = (req as any).user._id;
    const accountId = req.query.accountId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

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

    // Build filter
    const filter: any = { accountId };
    
    if (req.query.type) filter.type = req.query.type;
    if (req.query.category) filter.category = new RegExp(req.query.category as string, 'i');
    if (req.query.walletId) filter.walletId = req.query.walletId;
    
    if (req.query.dateFrom || req.query.dateTo) {
      filter.date = {};
      if (req.query.dateFrom) filter.date.$gte = new Date(req.query.dateFrom as string);
      if (req.query.dateTo) filter.date.$lte = new Date(req.query.dateTo as string);
    }

    if (req.query.search) {
      filter.$or = [
        { description: new RegExp(req.query.search as string, 'i') },
        { category: new RegExp(req.query.search as string, 'i') }
      ];
    }

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .populate('walletId', 'name type color')
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Transaction.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    } as ApiResponse);

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get transactions'
    } as ApiResponse);
  }
});

// Create transaction
router.post('/', [
  authenticate,
  body('accountId').isMongoId().withMessage('Invalid account ID'),
  body('walletId').isMongoId().withMessage('Invalid wallet ID'),
  body('amount').isNumeric().custom(value => value !== 0).withMessage('Amount cannot be zero'),
  body('type').isIn(['income', 'expense', 'loan_received', 'loan_given']).withMessage('Invalid transaction type'),
  body('category').trim().isLength({ min: 1, max: 100 }).withMessage('Category must be between 1 and 100 characters'),
  body('description').trim().isLength({ min: 1, max: 500 }).withMessage('Description must be between 1 and 500 characters'),
  body('date').isISO8601().withMessage('Invalid date format'),
  validateRequest
], async (req, res) => {
  try {
    const userId = (req as any).user._id;
    const { accountId, walletId, amount, type, category, description, date } = req.body;

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

    // Verify wallet belongs to account
    const wallet = await Wallet.findOne({ _id: walletId, accountId });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        error: 'Wallet not found or does not belong to this account'
      } as ApiResponse);
    }

    // Calculate signed amount
    const isIncome = ['income', 'loan_received'].includes(type);
    const signedAmount = isIncome ? Math.abs(amount) : -Math.abs(amount);

    // Check if wallet has sufficient balance for expenses
    if (!isIncome && wallet.balance < Math.abs(amount)) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient wallet balance'
      } as ApiResponse);
    }

    // Create transaction
    const transaction = new Transaction({
      accountId,
      walletId,
      amount: signedAmount,
      type,
      category,
      description,
      date: new Date(date)
    });

    await transaction.save();

    // Update wallet balance
    wallet.balance += signedAmount;
    await wallet.save();

    // Populate wallet info
    await transaction.populate('walletId', 'name type color');

    res.status(201).json({
      success: true,
      data: transaction
    } as ApiResponse);

  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create transaction'
    } as ApiResponse);
  }
});

// Update transaction
router.put('/:id', [
  authenticate,
  param('id').isMongoId().withMessage('Invalid transaction ID'),
  body('category').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Category must be between 1 and 100 characters'),
  body('description').optional().trim().isLength({ min: 1, max: 500 }).withMessage('Description must be between 1 and 500 characters'),
  validateRequest
], async (req, res) => {
  try {
    const userId = (req as any).user._id;
    const transactionId = req.params.id;
    const updates = req.body;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      } as ApiResponse);
    }

    // Verify user has access to account
    const account = await Account.findOne({
      _id: transaction.accountId,
      'members.userId': userId
    });

    if (!account) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this transaction'
      } as ApiResponse);
    }

    Object.assign(transaction, updates);
    await transaction.save();

    await transaction.populate('walletId', 'name type color');

    res.json({
      success: true,
      data: transaction
    } as ApiResponse);

  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update transaction'
    } as ApiResponse);
  }
});

// Delete transaction
router.delete('/:id', [
  authenticate,
  param('id').isMongoId().withMessage('Invalid transaction ID'),
  validateRequest
], async (req, res) => {
  try {
    const userId = (req as any).user._id;
    const transactionId = req.params.id;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      } as ApiResponse);
    }

    // Verify user has access to account
    const account = await Account.findOne({
      _id: transaction.accountId,
      'members.userId': userId
    });

    if (!account) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this transaction'
      } as ApiResponse);
    }

    // Reverse wallet balance
    const wallet = await Wallet.findById(transaction.walletId);
    if (wallet) {
      wallet.balance -= transaction.amount;
      await wallet.save();
    }

    await Transaction.findByIdAndDelete(transactionId);

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete transaction'
    } as ApiResponse);
  }
});

export default router;