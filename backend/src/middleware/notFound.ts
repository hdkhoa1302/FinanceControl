import { Request, Response } from 'express';
import { ApiResponse } from '@/types';

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  } as ApiResponse);
};