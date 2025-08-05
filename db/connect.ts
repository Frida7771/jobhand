import mongoose from 'mongoose';

const connectDB = async (url: string) => {
  try {
    await mongoose.connect(url);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB; 