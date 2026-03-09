// src/services/auth.service.ts
import prisma from "../prisma";
import { hashPassword, comparePassword } from "../utils/hash";
import { signAccessToken, signRefreshToken } from "../utils/jwt";

export class AuthService {
  static async login(serviceNumber: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { serviceNumber },
      include: { student: true },
    });

    if (!user) throw new Error("User not found");
    if (!user.isActive) throw new Error("User is inactive");

    const valid = await comparePassword(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const accessToken = signAccessToken({ id: user.id, role: user.role });
    const refreshToken = signRefreshToken({ id: user.id, role: user.role });

    // Store hashed refresh token in DB
    // await prisma.user.update({
    //   where: { id: user.id },
    //   data: { refreshToken }, // optional: hash if needed
    // });

    return { accessToken, refreshToken, role: user.role, userId: user.id };
  }

  static async refreshToken(oldToken: string) {
    // verify refresh token
    try {
      const payload = signAccessToken({}); // placeholder, replaced in controller
      // Will implement verification in controller
      return payload;
    } catch (err) {
      throw new Error("Invalid refresh token");
    }
  }

  static async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const valid = await comparePassword(oldPassword, user.password);
    if (!valid) throw new Error("Old password is incorrect");

    const newHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { password: newHash },
    });

    return true;
  }

  static async logout(userId: number) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return true;
  }
}