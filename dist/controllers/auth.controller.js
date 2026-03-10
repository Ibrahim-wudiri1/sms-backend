"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_js_1 = require("../config/index.js");
class AuthController {
    static async login(req, res) {
        try {
            const { serviceNumber, password } = req.body;
            const data = await auth_service_1.AuthService.login(serviceNumber, password);
            res.cookie("refreshToken", data.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.json({ accessToken: data.accessToken, role: data.role, userId: data.userId });
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    static async refresh(req, res) {
        try {
            const token = req.cookies.refreshToken;
            if (!token)
                return res.status(401).json({ message: "No refresh token" });
            const payload = jsonwebtoken_1.default.verify(token, index_js_1.JWT_REFRESH_SECRET);
            const accessToken = jsonwebtoken_1.default.sign({ id: payload.id, role: payload.role }, index_js_1.JWT_REFRESH_SECRET, { expiresIn: "15m" });
            res.json({ accessToken });
        }
        catch (err) {
            res.status(401).json({ message: "Invalid refresh token" });
        }
    }
    static async logout(req, res) {
        try {
            const token = req.cookies.refreshToken;
            if (!token)
                return res.sendStatus(204);
            const payload = jsonwebtoken_1.default.verify(token, index_js_1.JWT_REFRESH_SECRET);
            await auth_service_1.AuthService.logout(payload.id);
            res.clearCookie("refreshToken");
            res.sendStatus(204);
        }
        catch {
            res.sendStatus(204);
        }
    }
    static async changePassword(req, res) {
        try {
            const userId = req.user.id;
            const { oldPassword, newPassword } = req.body;
            await auth_service_1.AuthService.changePassword(userId, oldPassword, newPassword);
            res.json({ message: "Password changed successfully" });
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map