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
    const payload = verifyJWT(token);
    console.log('=== JWT Debug ===');
    console.log('JWT payload:', payload);
    console.log('User ID:', payload.userId);
    console.log('User role from JWT:', payload.role);
    
    const { userId } = payload;
    
    // 🔥 关键修复：从数据库获取最新的用户信息
    const user = await User.findById(userId).select('role email');
    if (!user) throw new UnauthenticatedError('user not found');
    
    console.log('User from database:', { email: user.email, role: user.role });
    
    // 确保角色正确性
    const adminEmail = process.env.ADMIN_EMAIL || 'frida16571@gmail.com';
    const actualRole = user.email === adminEmail ? 'admin' : 'user';
    
    console.log('Admin email:', adminEmail);
    console.log('Is admin?', user.email === adminEmail);
    console.log('Final role:', actualRole);
    console.log('=================');
    
    const testUser = userId === '64b2c07ccac2efc972ab0eca';
    req.user = { userId, role: actualRole, testUser };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
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