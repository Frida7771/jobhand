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


export const cleanupDatabase = async (req, res) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'frida16571@gmail.com';
  
  try {
    // 修复所有非管理员用户的角色
    const result = await User.updateMany(
      { 
        email: { $ne: adminEmail }, 
        role: 'admin' 
      },
      { 
        $set: { role: 'user' } 
      }
    );
    
    // 确保管理员邮箱的角色正确
    await User.updateOne(
      { email: adminEmail },
      { $set: { role: 'admin' } },
      { upsert: false }
    );
    
    console.log(`Database cleanup completed. Fixed ${result.modifiedCount} users.`);
    
    res.json({ 
      success: true,
      message: 'Database cleanup completed',
      fixedUsers: result.modifiedCount 
    });
  } catch (error) {
    console.error('Database cleanup error:', error);
    res.status(500).json({ error: 'Cleanup failed' });
  }
};



// 在 authController.js 中添加 调试用户信息
export const debugUsers = async (r条是用户信息eq, res) => {
  const users = await User.find({}, 'email role provider googleId').limit(10);
  console.log('=== Database Users Debug ===');
  users.forEach(user => {
    console.log(`Email: ${user.email}, Role: ${user.role}, Provider: ${user.provider || 'local'}`);
  });
  console.log('============================');
  
  res.json({
    message: 'Check server logs for user data',
    userCount: users.length,
    users: users.map(u => ({ email: u.email, role: u.role, provider: u.provider }))
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