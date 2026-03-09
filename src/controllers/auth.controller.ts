// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET } from "../config/index.js";

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { serviceNumber, password } = req.body;
      const data = await AuthService.login(serviceNumber, password);

      res.cookie("refreshToken", data.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken: data.accessToken, role: data.role, userId: data.userId });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const token = req.cookies.refreshToken;
      if (!token) return res.status(401).json({ message: "No refresh token" });

      const payload = jwt.verify(token, JWT_REFRESH_SECRET) as any;

      const accessToken = jwt.sign({ id: payload.id, role: payload.role }, JWT_REFRESH_SECRET, { expiresIn: "15m" });
      res.json({ accessToken });
    } catch (err: any) {
      res.status(401).json({ message: "Invalid refresh token" });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const token = req.cookies.refreshToken;
      if (!token) return res.sendStatus(204);

      const payload: any = jwt.verify(token, JWT_REFRESH_SECRET);
      await AuthService.logout(payload.id);

      res.clearCookie("refreshToken");
      res.sendStatus(204);
    } catch {
      res.sendStatus(204);
    }
  }

  static async changePassword(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { oldPassword, newPassword } = req.body;

      await AuthService.changePassword(userId, oldPassword, newPassword);
      res.json({ message: "Password changed successfully" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}