import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import doctorRouter from "./routes/doctor.route.js";
import { errorHandler } from "./middlewares/error.js";
import userRouter from "./routes/user.route.js";
import adminRouter from "./routes/admin.route.js";
import appointmentRouter from "./routes/appointment.route.js";
import patientRouter from "./routes/patient.route.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  await dbConnection();
  next();
});

app.get("/", (_, res) => {
  res.send("Hello, World!");
});

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/patient", patientRouter);
app.use("/doctor", doctorRouter);
app.use("/admin", adminRouter);
app.use("/appointment", appointmentRouter);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
