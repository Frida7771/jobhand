import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel';
import Job from '../models/JobModel';
import cloudinary from 'cloudinary';
import { formatImage } from '../middleware/multerMiddleware';
import { AuthenticatedRequest } from '../types/index.js';

// 🧠 You should have a global declaration of req.user and req.file like this:
// req.user = { userId: string, ... }
// req.file = Express.Multer.File

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById((req.user as any)?.userId);
  if (!user) {
    res.status(StatusCodes.NOT_FOUND).json({ msg: 'User not found' });
    return;
  }

  const userWithoutPassword = user.toJSON(); // Assuming toJSON removes password
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};

export const getApplicationStats = async (_req: Request, res: Response): Promise<void> => {
  const users = await User.countDocuments();
  const jobs = await Job.countDocuments();
  res.status(StatusCodes.OK).json({ users, jobs });
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const newUser = { ...req.body };
  delete newUser.password;
  delete newUser.role;

  // 🧩 Optional typing: req.file as Express.Multer.File
  if (req.file) {
    const file = formatImage(req.file); // base64 string
    const uploadRes = await cloudinary.v2.uploader.upload(file);
    newUser.avatar = uploadRes.secure_url;
    newUser.avatarPublicId = uploadRes.public_id;
  }

  const updatedUser = await User.findByIdAndUpdate((req.user as any)?.userId, newUser, {
    new: true,
  });

  if (req.file && (updatedUser as any)?.avatarPublicId) {
    await cloudinary.v2.uploader.destroy((updatedUser as any).avatarPublicId);
  }

  res.status(StatusCodes.OK).json({ msg: 'update user' });
};

export const getAllUsersForAdmin = async (_req: Request, res: Response): Promise<void> => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.status(StatusCodes.OK).json({ users });
};
