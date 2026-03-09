// src/controllers/student.controller.ts
import { Request, Response } from "express";
import prisma from "../prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export class StudentController {
  // Get student's own profile
  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const student = await prisma.student.findUnique({
        where: { userId },
        include: {
          user: true,
          enrollments: {
            include: {
              course: true,
              academicRecords: true,
            },
          },
        },
      });

      if (!student) return res.status(404).json({ message: "Student not found" });

      res.json(student);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  // Get student's enrollments
  static async getEnrollments(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const enrollments = await prisma.enrollment.findMany({
        where: { studentId: (await prisma.student.findUnique({ where: { userId } }))!.id },
        include: {
          course: true,
          academicRecords: true,
        },
        orderBy: { startedAt: "desc" },
      });

      res.json(enrollments);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}