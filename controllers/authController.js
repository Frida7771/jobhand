import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel.js';
import { comparePassword, hashPassword } from '../utils/passwordUtils.js';
import { UnauthenticatedError } from '../errors/customErrors.js';
import { createJWT } from '../utils/tokenUtils.js';

export const register = async (req, res) => {
  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword;

  // 检查是否为管理员邮箱（
  const adminEmail = process.env.ADMIN_EMAIL || 'frida16571@gmail.com'; 
  req.body.role = adminEmails.includes(req.body.email) ? 'admin' : 'user';

  const user = await User.create(req.body);
  console.log(`New user registered: ${req.body.email}, role: ${req.body.role}`);
  
  // 返回用户角色信息
  res.status(StatusCodes.CREATED).json({ 
    msg: 'user created',
    user: {
      role: user.role,
      name: user.name
    }
  });
};

export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  const isValidUser =
    user && (await comparePassword(req.body.password, user.password));

  if (!isValidUser) throw new UnauthenticatedError('invalid credentials');

  const token = createJWT({ userId: user._id, role: user.role });

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
  });

  console.log(`User logged in: ${req.body.email}, role: ${user.role}`);

  // 重要：返回用户角色信息，让前端决定重定向
  res.status(StatusCodes.OK).json({ 
    msg: 'user logged in',
    user: {
      role: user.role,
      name: user.name,
      email: user.email
    }
  });
};

export const logout = (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};