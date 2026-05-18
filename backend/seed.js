import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const ADMIN = {
  name: "Admin",
  email:  "admin@hms.com" || process.env.ADMIN_EMAIL,
  password: "admin123456",
  phone: "03000000000",
  role: "admin",
};

const DB_NAME = "health-care";

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ["patient", "doctor", "admin"], default: "patient" },
    phone:    { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

const seed = async () => {
  try {
    const uri = `${process.env.MONGO_URI}/${DB_NAME}`;
    await mongoose.connect(uri, { bufferCommands: false });
    console.log("MongoDB connected");

    const existing = await User.findOne({ email: ADMIN.email });

    if (existing) {
      if (existing.role !== "admin") {
        existing.role = "admin";
        await existing.save();
        console.log(`Existing user "${ADMIN.email}" promoted to admin.`);
      } else {
        console.log(`ℹ Admin user "${ADMIN.email}" already exists. Nothing to do.`);
      }
    } else {
      const hashedPassword = await bcrypt.hash(ADMIN.password, 10);
      await User.create({ ...ADMIN, password: hashedPassword });
      console.log(`  Admin user created successfully!`);
      console.log(`   Email   : ${ADMIN.email}`);
      console.log(`   Password: ${ADMIN.password}`);
    }

    await mongoose.disconnect();
    console.log(" Disconnected. Done.");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
