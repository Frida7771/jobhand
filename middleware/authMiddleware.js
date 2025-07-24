import {
  UnauthenticatedError,
  UnauthorizedError,
  BadRequestError,
} from '../errors/customErrors.js';
import { verifyJWT } from '../utils/tokenUtils.js';

export const authenticateUser = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) throw new UnauthenticatedError('authentication invalid');


//debug jwt
  try {
    const payload = verifyJWT(token);
    console.log('=== JWT Debug ===');
    console.log('JWT payload:', payload);
    console.log('User ID:', payload.userId);
    console.log('User role from JWT:', payload.role);
    console.log('=================');
    
    const { userId, role } = payload;
    const testUser = userId === '64b2c07ccac2efc972ab0eca';
    req.user = { userId, role, testUser };
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
