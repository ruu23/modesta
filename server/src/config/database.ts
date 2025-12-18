import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error: A parameter cannot be found that matches parameter name 'Chord'");
    process.exit(1);
  }
};

export default connectDB;
