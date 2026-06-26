import express from "express";
import dotenv from "dotenv";
import { dbConnection } from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import doctorRouter from "./routes/doctor.route.js";
import { errorHandler } from "./middlewares/error.js";
import userRouter from "./routes/user.route.js";
import adminRouter from "./routes/admin.route.js";
import appointmentRouter from "./routes/appointment.route.js";
import patientRouter from "./routes/patient.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import { globalRateLimiter, authRateLimiter } from "./middlewares/security.js";
import aiRouter from "./routes/ai.route.js";

dotenv.config();

const app = express();

// Secure HTTP Headers
app.use(helmet());

// Compress HTTP Responses
app.use(compression());

// Custom NoSQL Injection Sanitization for Express 5 compatibility (mutates properties without reassigning read-only objects)
const sanitizeObject = (obj) => {
  if (obj && typeof obj === "object") {
    for (const key in obj) {
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key];
      } else if (typeof obj[key] === "object") {
        sanitizeObject(obj[key]);
      }
    }
  }
};

const customMongoSanitize = (req, res, next) => {
  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);
  next();
};

app.use(customMongoSanitize);

// Parse cookie headers into req.cookies
app.use(cookieParser());

// Rate Limiting
app.use(globalRateLimiter);

// Configure CORS with credentials
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (_, res) => {
  res.send("Hello, World!");
});

app.use("/auth", authRateLimiter, authRouter);
app.use("/user", userRouter);
app.use("/patient", patientRouter);
app.use("/doctor", doctorRouter);
app.use("/admin", adminRouter);
app.use("/appointment", appointmentRouter);
app.use("/ai", aiRouter);

app.use(errorHandler);

// Connect to DB once, then start server
dbConnection().then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
  });
}).catch((err) => {
  console.error("Failed to connect to database:", err);
  process.exit(1);
});
