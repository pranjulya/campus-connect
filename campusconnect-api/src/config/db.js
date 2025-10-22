import mongoose from 'mongoose';
import { getMongoUri } from './env.js';
import logger from './logger.js';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully!');
  } catch (err) {
    logger.error(`MongoDB connection error: ${err.message}`, { err });
    process.exit(1);
  }
};

export default connectDB;
