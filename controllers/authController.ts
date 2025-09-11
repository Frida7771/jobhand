import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel';
import { comparePassword, hashPassword } from '../utils/passwordUtils';
import { UnauthenticatedError } from '../errors/customErrors';
import { createJWT } from '../utils/tokenUtils';

// 🧩 Optional: define user input types
interface RegisterRequest extends Request {
  body: {
    name: string;
    email: string;
    password: string;
    role?: string;
  };
}

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

// ✅ REGISTER
export const register = async (req: RegisterRequest, res: Response): Promise<void> => {
  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword;

  const adminEmail = process.env.ADMIN_EMAIL || 'frida16571@gmail.com';
  req.body.role = req.body.email === adminEmail ? 'admin' : 'user';

  const user = await User.create(req.body);

  console.log(`New user registered: ${user.email}, role: ${user.role}`);

  res.status(StatusCodes.CREATED).json({
    msg: 'user created',
    user: {
      role: user.role,
      name: user.name,
    },
  });
};

// ✅ LOGIN
export const login = async (req: LoginRequest, res: Response): Promise<void> => {
  const user = await User.findOne({ email: req.body.email });

  const isValidUser =
    user && (await comparePassword(req.body.password, user.password));

  if (!isValidUser) {
    throw new UnauthenticatedError('invalid credentials');
  }

  const token = createJWT({ userId: user._id.toString(), role: user.role });

  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  console.log(`User logged in: ${user.email}, role: ${user.role}`);

  res.status(StatusCodes.OK).json({
    msg: 'user logged in',
    user: {
      role: user.role,
      name: user.name,
      email: user.email,
    },
  });
};

// ✅ LOGOUT
export const logout = (_req: Request, res: Response): void => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

// ✅ DEBUG USERS
export const debugUsers = async (_req: Request, res: Response): Promise<void> => {
  const users = await User.find({}, 'email role provider googleId').limit(10);

  console.log('=== Database Users Debug ===');
  users.forEach((user) => {
    console.log(
      `Email: ${user.email}, Role: ${user.role}, Provider: ${user.provider || 'local'}`
    );
  });
  console.log('============================');

  res.json({
    message: 'Check server logs for user data',
    userCount: users.length,
    users: users.map((u) => ({
      email: u.email,
      role: u.role,
      provider: u.provider,
    })),
  });
};
