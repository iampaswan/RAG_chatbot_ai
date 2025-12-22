import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const DATABASE_URI: any = process.env.MONGO_URI

export const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_URI)
    console.log('MongoDB Connected')

  } catch (err) {
    console.log("Error in DB connection", err)
  }

}