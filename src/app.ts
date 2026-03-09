// src/app.ts
import express from "express";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import studentRoutes from "./routes/student.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import { FRONTEND_URL } from "./config/index";

const app = express();
// nubh
// Middleware
app.use(helmet());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
  })
);



app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);

// Error Handler
app.use(errorMiddleware);

export default app;