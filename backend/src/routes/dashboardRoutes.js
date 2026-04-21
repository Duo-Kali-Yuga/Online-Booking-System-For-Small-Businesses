import express from "express";

import { protect, isAdmin } from "../middlewares/authMiddleware.js";
import { getDashboard } from "../controllers/dashboardController.js";

const router = express.Router();


router.get("/dashboard", protect, isAdmin, getDashboard);

export default router;