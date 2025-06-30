import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validation';
import { BillSplit } from '@/models/BillSplit';
import { Account } from '@/models/Account';
import { ApiResponse } from '@/types';

const router = Router();

// Get bill splits
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

    const billSplits = await BillSplit.find({ accountId })
      .populate('payerId', 'name email')
      .sort({ date: -1, createdAt: -1 });

    res.json({
      success: true,
      data: billSplits
    } as ApiResponse);

  } catch (error) {
    console.error('Get bill splits error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get bill splits'
    } as ApiResponse);
  }
});

// Create bill split
router.post('/', [
  authenticate,
  body('accountId').isMongoId().withMessage('Invalid account ID'),
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('totalAmount').isFloat({ min: 0.01 }).withMessage('Total amount must be positive'),
  body('payerId').isMongoId().withMessage('Invalid payer ID'),
  body('payerName').trim().isLength({ min: 1 }).withMessage('Payer name is required'),
  body('participants').isArray({ min: 1 }).withMessage('At least one participant is required'),
  body('participants.*.name').trim().isLength({ min: 1 }).withMessage('Participant name is required'),
  body('participants.*.amount').isFloat({ min: 0 }).withMessage('Participant amount must be non-negative'),
  body('participants.*.share').isFloat({ min: 0, max: 100 }).withMessage('Share must be between 0 and 100'),
  body('splitType').isIn(['equal', 'custom', 'percentage']).withMessage('Invalid split type'),
  body('date').isISO8601().withMessage('Invalid date format'),
  validateRequest
], async (req, res) => {
  try {
    const userId = (req as any).user._id;
    const { accountId, title, description, totalAmount, payerId, payerName, participants, splitType, date } = req.body;

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

    // Validate total amounts match
    const totalParticipantAmount = participants.reduce((sum: number, p: any) => sum + p.amount, 0);
    if (Math.abs(totalParticipantAmount - totalAmount) > 0.01) {
      return res.status(400).json({
        success: false,
        error: 'Total participant amounts must equal bill total'
      } as ApiResponse);
    }

    const billSplit = new BillSplit({
      accountId,
      title,
      description,
      totalAmount,
      payerId,
      payerName,
      participants: participants.map((p: any) => ({
        ...p,
        paid: false
      })),
      splitType,
      date: new Date(date),
      settled: false
    });

    await billSplit.save();

    res.status(201).json({
      success: true,
      data: billSplit
    } as ApiResponse);

  } catch (error) {
    console.error('Create bill split error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create bill split'
    } as ApiResponse);
  }
});

// Update participant payment
router.patch('/:id/participants/:participantName/payment', [
  authenticate,
  param('id').isMongoId().withMessage('Invalid bill split ID'),
  param('participantName').trim().isLength({ min: 1 }).withMessage('Participant name is required'),
  body('paid').isBoolean().withMessage('Paid must be a boolean'),
  validateRequest
], async (req, res) => {
  try {
    const userId = (req as any).user._id;
    const billSplitId = req.params.id;
    const participantName = req.params.participantName;
    const { paid } = req.body;

    const billSplit = await BillSplit.findById(billSplitId);
    if (!billSplit) {
      return res.status(404).json({
        success: false,
        error: 'Bill split not found'
      } as ApiResponse);
    }

    // Verify user has access to account
    const account = await Account.findOne({
      _id: billSplit.accountId,
      'members.userId': userId
    });

    if (!account) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this bill split'
      } as ApiResponse);
    }

    // Update participant payment
    const participant = billSplit.participants.find(p => p.name === participantName);
    if (!participant) {
      return res.status(404).json({
        success: false,
        error: 'Participant not found'
      } as ApiResponse);
    }

    participant.paid = paid;
    participant.paidDate = paid ? new Date() : undefined;

    // Check if all participants have paid
    const allPaid = billSplit.participants.every(p => p.paid);
    billSplit.settled = allPaid;

    await billSplit.save();

    res.json({
      success: true,
      data: billSplit
    } as ApiResponse);

  } catch (error) {
    console.error('Update participant payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update participant payment'
    } as ApiResponse);
  }
});

// Settle bill split
router.patch('/:id/settle', [
  authenticate,
  param('id').isMongoId().withMessage('Invalid bill split ID'),
  validateRequest
], async (req, res) => {
  try {
    const userId = (req as any).user._id;
    const billSplitId = req.params.id;

    const billSplit = await BillSplit.findById(billSplitId);
    if (!billSplit) {
      return res.status(404).json({
        success: false,
        error: 'Bill split not found'
      } as ApiResponse);
    }

    // Verify user has access to account
    const account = await Account.findOne({
      _id: billSplit.accountId,
      'members.userId': userId
    });

    if (!account) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this bill split'
      } as ApiResponse);
    }

    if (billSplit.settled) {
      return res.status(400).json({
        success: false,
        error: 'Bill split already settled'
      } as ApiResponse);
    }

    // Mark all participants as paid
    billSplit.participants.forEach(p => {
      p.paid = true;
      p.paidDate = p.paidDate || new Date();
    });
    billSplit.settled = true;

    await billSplit.save();

    res.json({
      success: true,
      data: billSplit
    } as ApiResponse);

  } catch (error) {
    console.error('Settle bill split error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to settle bill split'
    } as ApiResponse);
  }
});

// Delete bill split
router.delete('/:id', [
  authenticate,
  param('id').isMongoId().withMessage('Invalid bill split ID'),
  validateRequest
], async (req, res) => {
  try {
    const userId = (req as any).user._id;
    const billSplitId = req.params.id;

    const billSplit = await BillSplit.findById(billSplitId);
    if (!billSplit) {
      return res.status(404).json({
        success: false,
        error: 'Bill split not found'
      } as ApiResponse);
    }

    // Verify user has access to account
    const account = await Account.findOne({
      _id: billSplit.accountId,
      'members.userId': userId
    });

    if (!account) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this bill split'
      } as ApiResponse);
    }

    await BillSplit.findByIdAndDelete(billSplitId);

    res.json({
      success: true,
      message: 'Bill split deleted successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Delete bill split error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete bill split'
    } as ApiResponse);
  }
});

export default router;