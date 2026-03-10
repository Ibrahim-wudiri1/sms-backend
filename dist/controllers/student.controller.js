"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class StudentController {
    // Get student's own profile
    static async getProfile(req, res) {
        try {
            const userId = req.user.id;
            const student = await prisma_1.default.student.findUnique({
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
            if (!student)
                return res.status(404).json({ message: "Student not found" });
            res.json(student);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    // Get student's enrollments
    static async getEnrollments(req, res) {
        try {
            const userId = req.user.id;
            const enrollments = await prisma_1.default.enrollment.findMany({
                where: { studentId: (await prisma_1.default.student.findUnique({ where: { userId } })).id },
                include: {
                    course: true,
                    academicRecords: true,
                },
                orderBy: { startedAt: "desc" },
            });
            res.json(enrollments);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
}
exports.StudentController = StudentController;
//# sourceMappingURL=student.controller.js.map