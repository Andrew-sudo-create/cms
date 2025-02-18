import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000
    });
    console.log('MongoDB Connected');
   
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1); // Exit process on database connection failure
  }
};

export default connectDB;