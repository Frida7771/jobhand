import {
  UnauthenticatedError,
  UnauthorizedError,
  BadRequestError,
} from '../errors/customErrors.js';
import { verifyJWT } from '../utils/tokenUtils.js';
import User from '../models/UserModel.js';

export const authenticateUser = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) throw new UnauthenticatedError('authentication invalid');

  try {
    const { userId } = verifyJWT(token);
    
    // 🔥 关键修复：从数据库获取最新的用户信息
    const user = await User.findById(userId).select('role email');
    if (!user) throw new UnauthenticatedError('user not found');
    
    // 确保角色正确性
    const adminEmail = process.env.ADMIN_EMAIL || 'frida16571@gmail.com';
    const actualRole = user.email === adminEmail ? 'admin' : 'user';
    
    req.user = { userId, role: actualRole, testUser: userId === '64b2c07ccac2efc972ab0eca' };
    
    next();
  } catch (error) {
    throw new UnauthenticatedError('authentication invalid');
  }
};

export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError('Unauthorized to access this route');
    }
    next();
  };
};

export const checkForTestUser = (req, res, next) => {
  if (req.user.testUser) throw new BadRequestError('Demo User. Read Only!');
  next();
};