"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
// src/services/auth.service.ts
const prisma_1 = __importDefault(require("../prisma"));
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
class AuthService {
    static async login(serviceNumber, password) {
        const user = await prisma_1.default.user.findUnique({
            where: { serviceNumber },
            include: { student: true },
        });
        if (!user)
            throw new Error("User not found");
        if (!user.isActive)
            throw new Error("User is inactive");
        const valid = await (0, hash_1.comparePassword)(password, user.password);
        if (!valid)
            throw new Error("Invalid credentials");
        const accessToken = (0, jwt_1.signAccessToken)({ id: user.id, role: user.role });
        const refreshToken = (0, jwt_1.signRefreshToken)({ id: user.id, role: user.role });
        // Store hashed refresh token in DB
        // await prisma.user.update({
        //   where: { id: user.id },
        //   data: { refreshToken }, // optional: hash if needed
        // });
        return { accessToken, refreshToken, role: user.role, userId: user.id };
    }
    static async refreshToken(oldToken) {
        // verify refresh token
        try {
            const payload = (0, jwt_1.signAccessToken)({}); // placeholder, replaced in controller
            // Will implement verification in controller
            return payload;
        }
        catch (err) {
            throw new Error("Invalid refresh token");
        }
    }
    static async changePassword(userId, oldPassword, newPassword) {
        const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new Error("User not found");
        const valid = await (0, hash_1.comparePassword)(oldPassword, user.password);
        if (!valid)
            throw new Error("Old password is incorrect");
        const newHash = await (0, hash_1.hashPassword)(newPassword);
        await prisma_1.default.user.update({
            where: { id: userId },
            data: { password: newHash },
        });
        return true;
    }
    static async logout(userId) {
        await prisma_1.default.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
        return true;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map