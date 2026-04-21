import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";
// import serviceRoutes from "./routes/serviceRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import slotRoutes from "./routes/slotRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";



const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(errorHandler);

// API
app.use("/api/auth", authRoutes);
app.use("/api/providers", providerRoutes);
// app.use("/api/services", serviceRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/appointments", appointmentRoutes);



app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;