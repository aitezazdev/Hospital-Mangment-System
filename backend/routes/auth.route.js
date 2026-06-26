import express from "express";
import {
  getMe,
  SignInUser,
  SignUpUser,
  RefreshToken,
  LogOutUser,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post("/signup", SignUpUser);
authRouter.post("/signin", SignInUser);
authRouter.post("/refresh", RefreshToken);
authRouter.post("/logout", LogOutUser);
authRouter.get("/get-me", authMiddleware, getMe);

export default authRouter;
