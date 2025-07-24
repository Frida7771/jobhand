import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();

import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/UserModel.js';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://jobhand.onrender.com/api/v1/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google Profile:', profile);

    const adminEmail = process.env.ADMIN_EMAIL || 'frida16571@gmail.com';
    const userEmail = profile.emails[0].value;

    // 先通过 googleId 查找
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      // ✅ 即使找到用户，也要检查管理员角色
      let needsUpdate = false;
      
      if (userEmail === adminEmail && user.role !== 'admin') {
        user.role = 'admin';
        needsUpdate = true;
        console.log(`Updated existing user role to admin: ${userEmail}`);
      } else if (userEmail !== adminEmail && user.role === 'admin') {
        // 如果不是管理员邮箱但角色是管理员，降级为普通用户
        user.role = 'user';
        needsUpdate = true;
        console.log(`Downgraded user role to user: ${userEmail}`);
      }
      
      if (needsUpdate) {
        await user.save();
      }
      
      return done(null, user);
    }

    // check if user already exists by email
    user = await User.findOne({ email: profile.emails[0].value });

    if (user) {
      // 更新现有用户，添加 Google 信息
      user.googleId = profile.id;
      user.provider = 'google';

      // check if the user is admin
      if (userEmail === adminEmail && user.role !== 'admin') {
        user.role = 'admin';
        console.log(`Updated user role to admin: ${userEmail}`);
      } else if (userEmail !== adminEmail && user.role === 'admin') {
        user.role = 'user';
        console.log(`Downgraded user role to user: ${userEmail}`);
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
      email: profile.emails[0].value,
      avatar: profile.photos[0]?.value,
      provider: 'google',
      role: userEmail === adminEmail ? 'admin' : 'user',
    });

    return done(null, user);
  } catch (error) {
    console.error('Google OAuth Error:', error);
    return done(error, null);
  }
}));
// 这些对于 JWT 认证不是必需的，但为了完整性添加
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;