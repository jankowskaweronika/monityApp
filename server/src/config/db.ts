import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async() => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error('MONGO_URL is not defined in environment variables');
    }
    const mongoURL: string = process.env.MONGO_URL

    await mongoose.connect(mongoURL)

    console.log('MongoDB połączenie...')
  } catch (err: Error | unknown) {
    console.error('Błąd podczas łączenia z MongoDB:', err instanceof Error ? err.message : 'Unknown error')

    process.exit(1)
  }
}

export default connectDB