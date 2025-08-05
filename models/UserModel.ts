import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  lastName?: string;
  location?: string;
  role: 'user' | 'admin';
  googleId?: string;
  provider: 'local' | 'google';
  toJSON(): Record<string, any>; // custom toJSON method
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lastName: { type: String, default: 'lastName' },
    location: { type: String, default: 'my city' },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    googleId: { type: String },
    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
  },
  {
    timestamps: true,
  }
);

// ✂️ Hide password from response
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;
