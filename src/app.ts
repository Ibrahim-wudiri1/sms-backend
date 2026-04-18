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

app.set("trust proxy", 1);

const allowedOrigins = [
  "https://sms-frontend-rose.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(helmet());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

app.use("/api/auth", express.json(), authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", express.json(), studentRoutes);

app.use(errorMiddleware);

export default app;