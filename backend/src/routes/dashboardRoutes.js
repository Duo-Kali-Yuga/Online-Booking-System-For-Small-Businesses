import express from "express";

import { protect, isProvider } from "../middlewares/authMiddleware.js";
import { getDashboard, getClientDashboard } from "../controllers/dashboardController.js";

const router = express.Router();


router.get("/dashboard", protect, isProvider, getDashboard);
router.get("/client/dashboard", protect, getClientDashboard);

export default router;