import { Request, Response, NextFunction } from 'express';
import {
  UnauthenticatedError,
  UnauthorizedError,
  BadRequestError,
} from '../errors/customErrors.js';
import { verifyJWT } from '../utils/tokenUtils.js';
import User from '../models/UserModel.js';
import { AuthenticatedRequest } from '../types/index.js';

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { token } = req.cookies;
  if (!token) throw new UnauthenticatedError('Authentication invalid');

  try {
    const { userId } = verifyJWT(token);
    const user = await User.findById(userId).select('role email');

    if (!user) throw new UnauthenticatedError('User not found');

    const adminEmail = process.env.ADMIN_EMAIL || 'frida16571@gmail.com';
    const actualRole = user.email === adminEmail ? 'admin' : 'user';

    req.user = {
      userId,
      role: actualRole,
      testUser: userId === '64b2c07ccac2efc972ab0eca',
    };

    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid');
  }
};

export const authorizePermissions =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes((req.user as any).role)) {
      throw new UnauthorizedError('Unauthorized to access this route');
    }
    next();
  };

export const checkForTestUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if ((req.user as any)?.testUser) {
    throw new BadRequestError('Demo User. Read Only!');
  }
  next();
};
