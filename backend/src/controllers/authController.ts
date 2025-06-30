import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '@/models/User';
import { Account } from '@/models/Account';
import { AuthRequest, RegisterRequest, AuthResponse, ApiResponse } from '@/types';

const generateToken = (userId: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  return jwt.sign({ userId }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  } as any);
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name }: RegisterRequest = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      } as ApiResponse);
      return;
    }

    // Create user
    const user = new User({ email, password, name });
    await user.save();

    // Create default personal account
    const account = new Account({
      name: `${name}'s Personal Account`,
      type: 'personal',
      ownerId: user._id,
      members: [{
        userId: user._id,
        role: 'admin',
        name: name,
        joinedAt: new Date()
      }]
    });
    await account.save();

    // Update user's current account
    user.currentAccountId = account._id;
    await user.save();

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          currentAccountId: account._id.toString()
        }
      }
    } as ApiResponse<AuthResponse>);

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register user'
    } as ApiResponse);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: AuthRequest = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      } as ApiResponse);
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      } as ApiResponse);
      return;
    }

    // Generate token
    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          currentAccountId: user.currentAccountId?.toString()
        }
      }
    } as ApiResponse<AuthResponse>);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to login'
    } as ApiResponse);
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    res.json({
      success: true,
      data: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        currentAccountId: user.currentAccountId?.toString(),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    } as ApiResponse);

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get profile'
    } as ApiResponse);
  }
};

export const updateCurrentAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { accountId } = req.body as { accountId: string };

    user.currentAccountId = accountId;
    await user.save();

    res.json({
      success: true,
      data: { currentAccountId: user.currentAccountId.toString() }
    } as ApiResponse<{ currentAccountId: string }>);
  } catch (error) {
    console.error('Update current account error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update current account'
    } as ApiResponse);
  }
};