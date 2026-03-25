// src/routes/auth.routes.ts
import express from "express";
import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", express.json(), AuthController.login);
router.post("/refresh", express.json(), AuthController.refresh);
router.post("/logout",  AuthController.logout);
router.post("/change-password", express.json(), authMiddleware, AuthController.changePassword);

export default router;