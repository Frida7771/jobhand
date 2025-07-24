const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
import { Router } from 'express';
const router = Router();
import { login, logout, register } from '../controllers/authController.js';
import {
  validateRegisterInput,
  validateLoginInput,
} from '../middleware/validationMiddleware.js';

import rateLimiter from 'express-rate-limit';


import passport from '../middleware/passport.js';
import { createJWT } from '../utils/tokenUtils.js';

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { msg: 'IP rate limit exceeded, retry in 15 minutes.' },
});

router.post('/register', apiLimiter, validateRegisterInput, register);
router.post('/login', apiLimiter, validateLoginInput, login);
router.get('/logout', logout);



//oauth routes

router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${FRONTEND_URL}/login?error=oauth_failed`,
    session: false // 使用JWT，不需要session
  }),
  async (req, res) => {
    try {
      console.log('OAuth callback - User:', req.user.email);
      
      // 生成 JWT token（和普通登录一样的方式）
      const token = createJWT({ 
        userId: req.user._id, 
        role: req.user.role 
      });
      
      // 设置 cookie（和普通登录一样的方式）
      const oneDay = 1000 * 60 * 60 * 24;
      res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
      });
      
      console.log('JWT token generated for Google user');
      
       if (req.user.role === 'admin') {
        console.log('Redirecting admin to admin dashboard');
        res.redirect(`${FRONTEND_URL}/dashboard/admin`);
      } 
      
      else {
        console.log('Redirecting user to regular dashboard');
        res.redirect(`${FRONTEND_URL}/dashboard`);
      }
    } 
    
    catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(`${FRONTEND_URL}/login?error=oauth_callback_failed`);
    }
  }
);

export default router;
