import express from "express";

import { protect, isAdmin } from "../middlewares/authMiddleware.js";
import { getDashboard, getClientDashboard } from "../controllers/dashboardController.js";

const router = express.Router();


router.get("/dashboard", protect, isAdmin, getDashboard);
router.get("/client/dashboard", protect, getClientDashboard);

export default router;