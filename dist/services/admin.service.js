"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
// src/services/admin.service.ts
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../prisma"));
const hash_1 = require("../utils/hash");
class AdminService {
    // Create another Admin
    static async createAdmin(serviceNumber, password) {
        const hashed = await (0, hash_1.hashPassword)(password);
        return prisma_1.default.user.create({
            data: {
                serviceNumber,
                password: hashed,
                role: "ADMIN",
                isActive: true,
            },
        });
    }
    // Create Student + linked User
    static async createStudent(studentData) {
        const { serviceNumber, password, passportPhotoUrl, dateOfBirth, enlistmentDate, ...restProfile } = studentData;
        const hashed = await (0, hash_1.hashPassword)(password);
        // Convert date strings → Date objects (midnight UTC — safe for @db.Date)
        const birthDate = dateOfBirth ? new Date(dateOfBirth) : undefined;
        const enlistDate = enlistmentDate ? new Date(enlistmentDate) : undefined;
        // Optional: Validate they are valid dates
        if (dateOfBirth && isNaN(birthDate.getTime())) {
            throw new Error("Invalid dateOfBirth format. Use YYYY-MM-DD");
        }
        if (enlistmentDate && isNaN(enlistDate.getTime())) {
            throw new Error("Invalid enlistmentDate format. Use YYYY-MM-DD");
        }
        const user = await prisma_1.default.user.create({
            data: {
                serviceNumber,
                password: hashed,
                role: "STUDENT",
                isActive: true,
                student: {
                    create: {
                        ...restProfile,
                        passportPhotoUrl,
                        dateOfBirth: birthDate, // now a Date object
                        enlistmentDate: enlistDate, // now a Date object
                    },
                },
            },
            include: { student: true },
        });
        return user;
    }
    static async editStudent(studentId, studentData) {
        const { dateOfBirth, enlistmentDate, ...restProfile } = studentData;
        // Convert date strings → Date objects (midnight UTC — safe for @db.Date)
        const birthDate = dateOfBirth ? new Date(dateOfBirth) : undefined;
        const enlistDate = enlistmentDate ? new Date(enlistmentDate) : undefined;
        // Optional: Validate they are valid dates
        if (dateOfBirth && isNaN(birthDate.getTime())) {
            throw new Error("Invalid dateOfBirth format. Use YYYY-MM-DD");
        }
        if (enlistmentDate && isNaN(enlistDate.getTime())) {
            throw new Error("Invalid enlistmentDate format. Use YYYY-MM-DD");
        }
        return prisma_1.default.student.update({
            where: { id: studentId },
            data: {
                ...restProfile,
                dateOfBirth: birthDate,
                enlistmentDate: enlistDate,
            },
        });
    }
    static async deleteStudent(studentId) {
        // Soft delete: set isActive = false on User, but keep Student record for history
        const student = await prisma_1.default.student.findUnique({
            where: { id: studentId },
            include: { user: true },
        });
        if (!student)
            throw new Error("Student not found");
        return prisma_1.default.user.update({
            where: { id: student.userId },
            data: { isActive: false },
        });
    }
    static async createStudents(studentData) {
        const { serviceNumber, password, passportPhotoUrl, ...profile } = studentData;
        const hashed = await (0, hash_1.hashPassword)(password);
        const user = await prisma_1.default.user.create({
            data: {
                serviceNumber,
                password: hashed,
                role: "STUDENT",
                isActive: true,
                student: {
                    create: { ...profile, passportPhotoUrl },
                },
            },
            include: { student: true },
        });
        return user;
    }
    // Create Course
    static async createCourse(code, title, duration, description) {
        // Convert string → number
        const durationIntNumber = Number(duration);
        // Optional safety check
        if (isNaN(durationIntNumber) || durationIntNumber <= 0) {
            throw new Error("Duration must be a positive number");
        }
        return prisma_1.default.course.create({
            data: { code, title, duration: durationIntNumber, description },
        });
    }
    // get all courses
    static async getAllCourses() {
        return prisma_1.default.course.findMany({ where: { isDeleted: false } });
    }
    // Soft delete Course
    static async deleteCourse(courseId) {
        return prisma_1.default.course.update({
            where: { id: courseId },
            data: { isDeleted: true },
        });
    }
    // Enroll student
    static async enrollStudent(studentId, courseId) {
        // Check ACTIVE enrollment
        const active = await prisma_1.default.enrollment.findFirst({
            where: { studentId, status: "ACTIVE" },
        });
        if (active)
            throw new Error("Student already has ACTIVE enrollment");
        return prisma_1.default.enrollment.create({
            data: {
                studentId,
                courseId,
                status: "ACTIVE",
                startedAt: new Date(),
            },
        });
    }
    static async getAllActiveEnrollment() {
        return prisma_1.default.enrollment.findMany({
            where: { status: "ACTIVE" },
            include: { course: true, student: { include: { user: true } } },
        });
    }
    // Get enrollments for a student
    static async getEnrollmentsByStudent(studentId) {
        return prisma_1.default.enrollment.findMany({
            where: { studentId, status: "ACTIVE" },
            include: { course: true },
        });
    }
    // Update Enrollment Status
    static async updateEnrollmentStatus(enrollmentId, status) {
        const updateData = { status };
        if (status === "COMPLETED" || status === "RTU")
            updateData.completedAt = new Date();
        return prisma_1.default.enrollment.update({
            where: { id: enrollmentId },
            data: updateData,
        });
    }
    // Add Academic Record
    static async addAcademicRecord(enrollmentId, score, grade, remark) {
        return prisma_1.default.academicRecord.create({
            data: {
                enrollmentId,
                score,
                grade,
                remark,
            },
        });
    }
    static async getAcademicRecordsByStudent(studentId) {
        return prisma_1.default.academicRecord.findMany({
            where: { enrollment: { studentId } },
            include: { enrollment: { include: { course: true } } },
        });
    }
    static async getAllAcademicRecords() {
        return prisma_1.default.academicRecord.findMany({
            include: { enrollment: { include: { student: true, course: true } } },
        });
    }
    // Fetch all students
    static async getAllStudents(page, limit, search) {
        const whereCondition = {
            OR: [
                { firstName: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } },
                { lastName: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } },
                { user: { serviceNumber: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } } },
            ],
        };
        const total = await prisma_1.default.student.count({
            where: whereCondition,
        });
        const students = await prisma_1.default.student.findMany({
            where: whereCondition,
            skip: (page - 1) * limit,
            take: limit,
            include: { user: true, enrollments: true },
            orderBy: {
                createdAt: "desc",
            },
        });
        return {
            data: students,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    static async getAllStudentss() {
        return prisma_1.default.student.findMany({
            include: { user: true, enrollments: true },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    // Fetch single student
    static async getStudentById(id) {
        return prisma_1.default.student.findUnique({
            where: { id },
            include: { user: true, enrollments: { include: { course: true, academicRecords: true } } },
        });
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map