import express from "express";
import { allAppointmentsForAdmin, allDoctors, allPatients, approveDoctor, editProfile, fullList, getNotApprovedDoctors, notApproveDoctor } from "../controllers/admin.controller.js";
import { adminMiddleware } from "../middlewares/admin.js";
import { authMiddleware } from "../middlewares/auth.js";

const adminRouter = express.Router();

adminRouter.put("/doctors/:id/approve", authMiddleware, adminMiddleware, approveDoctor);
adminRouter.put("/doctors/:id/cancel", authMiddleware, adminMiddleware, notApproveDoctor);
adminRouter.get("/doctors/not-approved", authMiddleware, adminMiddleware, getNotApprovedDoctors);
adminRouter.get("/full-list", authMiddleware, adminMiddleware, fullList);
adminRouter.get("/appointments", authMiddleware, adminMiddleware, allAppointmentsForAdmin);
adminRouter.get("/doctors", authMiddleware, adminMiddleware, allDoctors);
adminRouter.get("/patients", authMiddleware, adminMiddleware, allPatients);
adminRouter.put("/edit-profile", authMiddleware, adminMiddleware, editProfile);

export default adminRouter;