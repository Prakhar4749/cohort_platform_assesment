import mongoose from 'mongoose';
// import logger from '../utils/logger.js';

export const connectDB = async () => {
    try {

        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in .env file!");
          }
      
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB successfully connected to: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};