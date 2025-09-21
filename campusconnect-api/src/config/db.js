import mongoose from 'mongoose';
import { getMongoUri } from './env.js';

const connectDB = async () => {
  try {
    await mongoose.connect(getMongoUri());
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
