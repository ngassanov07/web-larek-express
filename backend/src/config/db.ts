import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.DB_ADDRESS as string);
    console.log(`MongoDB is connected: ${conn.connection.host}`);
  } catch (err) {
    if (err instanceof Error) {
      console.log(`Error: ${err.message}`);
    } else {
      console.log('An unknown error occurred during database connection');
    }
    process.exit(1);
  }
};

export default connectDB;
