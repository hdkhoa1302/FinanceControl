import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiResponse } from '@/types';

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    
    res.status(400).json({
      success: false,
      error: errorMessages.join(', '),
      details: errors.array()
    } as ApiResponse);
    return;
  }
  
  next();
};