import mongoose from "mongoose";

export async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) throw "Please provide MongoDB URI";

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
}
