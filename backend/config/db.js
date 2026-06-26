import "./dns-setup.js";
import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const dbConnection = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("MongoDB connection FAILED:", error);
    process.exit(1);
  }

  console.log(`MongoDB connected!! Host: ${cached.conn.connection.host}`);

  // Auto-seed Admin user if not exists (runs locally and in serverless/production deployments like Vercel)
  try {
    const adminEmail = "admin@hms.com";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123456", 10);
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        phone: "03000000000",
        role: "admin",
      });
      console.log(`Auto-seeded default Admin account: ${adminEmail}`);
    } else {
      console.log(`Admin account ${adminEmail} verified.`);
    }
  } catch (seedErr) {
    console.error("Auto-seeding admin failed:", seedErr.message);
  }

  return cached.conn;
};