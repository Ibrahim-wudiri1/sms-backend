"use strict";
// src/config/index.ts
// import dotenv from "dotenv";
// dotenv.config();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIRECT_URL = exports.FRONTEND_URL = exports.REFRESH_TOKEN_EXPIRY = exports.ACCESS_TOKEN_EXPIRY = exports.JWT_REFRESH_SECRET = exports.JWT_ACCESS_SECRET = exports.DATABASE_URL = exports.PORT = void 0;
exports.PORT = process.env.PORT || 5000;
exports.DATABASE_URL = process.env.DATABASE_URL || "";
exports.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";
exports.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";
exports.ACCESS_TOKEN_EXPIRY = "15m";
exports.REFRESH_TOKEN_EXPIRY = "7d";
exports.FRONTEND_URL = process.env.FRONTEND_URL || "https://sms-frontend-rose.vercel.app";
exports.DIRECT_URL = process.env.DIRECT_URL || "";
// bcbdaun c 
//# sourceMappingURL=index.js.map