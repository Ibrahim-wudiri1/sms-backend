// src/config/index.ts
// import dotenv from "dotenv";
// dotenv.config();

export const PORT = process.env.PORT || 5000;
export const DATABASE_URL = process.env.DATABASE_URL || "";
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";
export const ACCESS_TOKEN_EXPIRY = "15m";
export const REFRESH_TOKEN_EXPIRY = "7d";
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
export const DIRECT_URL = process.env.DIRECT_URL || "";
// bcbdaun c 