import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validation';
import { Loan } from '@/models/Loan';
import { Account } from '@/models/Account';
import { ApiResponse } from '@/types';

const router = Router();

// Get loans
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

    const loans = await Loan.find({ accountId }).sort({ startDate: -1, createdAt: -1 });

    // Calculate summary
    const activeLentLoans = loans.filter(l => l.type === 'lent' && l.status === 'active');
    const activeBorrowedLoans = loans.filter(l => l.type === 'borrowed' && l.status === 'active');

    const summary = {
      totalLent: activeLentLoans.reduce((sum, l) => sum + (l.amount - l.paidAmount), 0),
      totalBorrowed: activeBorrowedLoans.reduce((sum, l) => sum + (l.amount - l.paidAmount), 0),
      activeLentCount: activeLentLoans.length,
      activeBorrowedCount: activeBorrowedLoans.length,
      overdueCount: loans.filter(l => l.status === 'overdue' || (l.status === 'active' && new Date() > l.dueDate)).length
    };

    res.json({
      success: true,
      data: {
        loans,
        summary
      }
    } as ApiResponse);

  } catch (error) {
    console.error('Get loans error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get loans'
    } as ApiResponse);
  }
});

// Create loan
router.post('/', [
  authenticate,
  body('accountId').isMongoId().withMessage('Invalid account ID'),
  body('type').isIn(['lent', 'borrowed']).withMessage('Invalid loan type'),
  body('counterpart').trim().isLength({ min: 1, max: 100 }).withMessage('Counterpart name must be between 1 and 100 characters'),
  body('counterpartContact').optional().trim().isLength({ max: 100 }).withMessage('Contact cannot exceed 100 characters'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be positive'),
  body('interestRate').isFloat({ min: 0, max: 100 }).withMessage('Interest rate must be between 0 and 100'),
  body('startDate').isISO8601().withMessage('Invalid start date format'),
  body('dueDate').isISO8601().withMessage('Invalid due date format'),
  body('description').trim().isLength({ min: 1, max: 500 }).withMessage('Description must be between 1 and 500 characters'),
  validateRequest
], async (req, res) => {
  try {
    const userId = (req as any).user._id;
    const { accountId, type, counterpart, counterpartContact, amount, interestRate, startDate, dueDate, description } = req.body;

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

    // Validate dates
    const start = new Date(startDate);
    const due = new Date(dueDate);
    
    if (due <= start) {
      return res.status(400).json({
        success: false,
        error: 'Due date must be after start date'
      } as ApiResponse);
    }

    const loan = new Loan({
      accountId,
      type,
      counterpart,
      counterpartContact,
      amount,
      interestRate: interestRate || 0,
      startDate: start,
      dueDate: due,
      description,
      status: 'active',
      paidAmount: 0
    });

    await loan.save();

    res.status(201).json({
      success: true,
      data: loan
    } as ApiResponse);

  } catch (error) {
    console.error('Create loan error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create loan'
    } as ApiResponse);
  }
});

// Make payment
router.patch('/:id/payment', [
  authenticate,
  param('id').isMongoId().withMessage('Invalid loan ID'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Payment amount must be positive'),
  validateRequest
], async (req, res) => {
  try {
    const userId = (req as any).user._id;
    const loanId = req.params.id;
    const { amount } = req.body;

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({
        success: false,
        error: 'Loan not found'
      } as ApiResponse);
    }

    // Verify user has access to account
    const account = await Account.findOne({
      _id: loan.accountId,
      'members.userId': userId
    });

    if (!account) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this loan'
      } as ApiResponse);
    }

    if (loan.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'Loan cannot be paid in current status'
      } as ApiResponse);
    }

    // Calculate total amount with interest
    const now = new Date();
    const days = Math.floor((now.getTime() - loan.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const months = days / 30;
    const interest = (loan.amount * loan.interestRate * months) / 100;
    const totalAmount = loan.amount + interest;

    const newPaidAmount = Math.min(loan.paidAmount + amount, totalAmount);
    const isFullyPaid = newPaidAmount >= totalAmount;

    loan.paidAmount = newPaidAmount;
    loan.status = isFullyPaid ? 'paid' : 'active';
    loan.paidDate = isFullyPaid ? new Date() : loan.paidDate;

    await loan.save();

    res.json({
      success: true,
      data: loan
    } as ApiResponse);

  } catch (error) {
    console.error('Make payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to make payment'
    } as ApiResponse);
  }
});

// Delete loan
router.delete('/:id', [
  authenticate,
  param('id').isMongoId().withMessage('Invalid loan ID'),
  validateRequest
], async (req, res) => {
  try {
    const userId = (req as any).user._id;
    const loanId = req.params.id;

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({
        success: false,
        error: 'Loan not found'
      } as ApiResponse);
    }

    // Verify user has access to account
    const account = await Account.findOne({
      _id: loan.accountId,
      'members.userId': userId
    });

    if (!account) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this loan'
      } as ApiResponse);
    }

    await Loan.findByIdAndDelete(loanId);

    res.json({
      success: true,
      message: 'Loan deleted successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Delete loan error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete loan'
    } as ApiResponse);
  }
});

export default router;