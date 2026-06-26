import rateLimit from "express-rate-limit";


export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 10000, 
  standardHeaders: "draft-7", 
  legacyHeaders: false, 
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
});


export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 1000, 
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login/registration attempts, please try again after 15 minutes",
  },
});
