import mongoose from 'mongoose';
import { getMongoUri } from './env.js';
import logger from './logger.js';

const connectDB = async () => {
  try {
    await mongoose.connect(getMongoUri());
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error(`MongoDB connection error: ${err.message}`, { err });
    process.exit(1);
  }
};

export default connectDB;
