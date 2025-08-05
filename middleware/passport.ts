import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();

import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import User from '../models/UserModel.js'; // ⚠️请先将 UserModel 也转为 .ts 模块
import { VerifyCallback } from 'passport-google-oauth20';

// 提供 OAuth 策略配置
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || ''
  },
  async (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ) => {
    try {
      console.log('Google Profile:', profile);

      const adminEmail = process.env.ADMIN_EMAIL || 'frida16571@gmail.com';
      const userEmail = profile.emails?.[0]?.value || '';

      // 用 googleId 查找用户
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        return done(null, user);
      }

      // 若已注册（email 存在），补充 Google 授权信息
      user = await User.findOne({ email: userEmail });
      if (user) {
        user.googleId = profile.id;
        user.provider = 'google';

        if (userEmail === adminEmail && user.role !== 'admin') {
          user.role = 'admin';
          console.log(`Updated user role to admin: ${userEmail}`);
        }

        await user.save();
        return done(null, user);
      }

      // 创建新用户
      const firstName = profile.name?.givenName || '';
      const lastName = profile.name?.familyName || 'User';

      user = await User.create({
        googleId: profile.id,
        name: firstName,
        lastName: lastName,
        email: userEmail,
        avatar: profile.photos?.[0]?.value,
        provider: 'google',
        role: userEmail === adminEmail ? 'admin' : 'user',
      });

      return done(null, user);
    } catch (error) {
      console.error('Google OAuth Error:', error);
      return done(error as Error, false);
    }
  }
));

// session 序列化与反序列化（不是 JWT 所必需）
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error as Error, false);
  }
});

export default passport;
