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
// Middleware
app.use(helmet());

const allowedOrigins = [
  'https://sms-frontend-rose.vercel.app', 
  'http://localhost:5173',             
  // add any preview URLs if needed, e.g. https://sms-frontend-*.vercel.app
];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true);

//     if (allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,                // very important if using cookies/auth
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   exposedHeaders: ['Content-Disposition'], // optional, if you send files
// }));
// app.use(
//   cors({origin: FRONTEND_URL, credentials: true,})
// );
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
  })
);
// app.options('*', cors()); // handles preflight OPTIONS requests for all routes


app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);

// Error Handler
app.use(errorMiddleware);

export default app;