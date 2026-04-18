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
    static async createAdmin(serviceNumber, password, role) {
        const hashed = await (0, hash_1.hashPassword)(password);
        if (!Object.values(client_1.Role).includes(role)) {
            throw new Error("Invalid role");
        }
        const examOfficerExist = await prisma_1.default.user.findFirst({
            where: { role: client_1.Role.EXAM_OFFICER },
        });
        if (examOfficerExist) {
            throw new Error("Exam Officer already exists. Only one Exam Officer allowed.");
        }
        return prisma_1.default.user.create({
            data: {
                serviceNumber,
                password: hashed,
                role: role,
                isActive: true,
            },
        });
    }
    static async getExamOfficer() {
        return await prisma_1.default.user.findMany({
            where: { role: "EXAM_OFFICER" },
            orderBy: { createdAt: "desc" }
        });
    }
    ;
    static async updateExamOfficer(id, data) {
        return prisma_1.default.user.update({
            where: { id },
            data: {
                serviceNumber: data.serviceNumber,
            },
        });
    }
    ;
    static async deactivateExamOfficer(id, data) {
        return prisma_1.default.user.update({
            where: { id },
            data: { isActive: data.isActive }
        });
    }
    // Create Student + linked User
    static async createStudent(studentData) {
        // console.log("Received studentData:", JSON.stringify(studentData, null, 2)); // ← add this
        const { serviceNumber, password, passportPhotoUrl, 
        // dateOfBirth, 
        enlistmentDate, ...studentProfile // ← now includes gender, firstName, etc.
         } = studentData;
        console.log("Spread studentProfile:", JSON.stringify(studentProfile, null, 2));
        const hashed = await (0, hash_1.hashPassword)(password);
        // const birthDate = dateOfBirth ? new Date(dateOfBirth) : undefined;
        const enlistDate = enlistmentDate ? new Date(enlistmentDate) : undefined;
        // if (dateOfBirth && isNaN(birthDate!.getTime())) {
        //   throw new Error("Invalid dateOfBirth format. Use YYYY-MM-DD");
        // }
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
                        ...studentProfile, //
                        passportPhotoUrl,
                        // dateOfBirth: birthDate,
                        enlistmentDate: enlistDate,
                    },
                },
            },
            include: { student: true },
        });
        return user;
    }
    // src/services/admin.service.ts
    static async editStudent(studentId, studentData) {
        const { 
        // dateOfBirth, 
        enlistmentDate, serviceNumber, // ← extract it
        id, // ← exclude id from studentFields
        userId, // ← exclude userId (foreign key)
        createdAt, // ← exclude timestamps
        updatedAt, // ← exclude timestamps
        ...studentFields // all other student fields
         } = studentData;
        // const birthDate = dateOfBirth ? new Date(dateOfBirth) : undefined;
        const enlistDate = enlistmentDate ? new Date(enlistmentDate) : undefined;
        // if (dateOfBirth && isNaN(birthDate!.getTime())) {
        //   throw new Error("Invalid dateOfBirth format. Use YYYY-MM-DD");
        // }
        if (enlistmentDate && isNaN(enlistDate.getTime())) {
            throw new Error("Invalid enlistmentDate format. Use YYYY-MM-DD");
        }
        // First, get the student to know the linked userId
        const student = await prisma_1.default.student.findUnique({
            where: { id: studentId },
            select: { userId: true }
        });
        if (!student)
            throw new Error("Student not found");
        // Update both User and Student in a transaction
        return prisma_1.default.$transaction(async (tx) => {
            // Update serviceNumber in User (if provided)
            if (serviceNumber) {
                await tx.user.update({
                    where: { id: student.userId },
                    data: { serviceNumber },
                });
            }
            // Update Student fields
            return tx.student.update({
                where: { id: studentId },
                data: {
                    ...studentFields,
                    // dateOfBirth: birthDate,
                    enlistmentDate: enlistDate,
                },
                include: { user: true },
            });
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
    static async getStudentsByCourse(courseId) {
        return prisma_1.default.enrollment.findMany({
            where: {
                courseId,
                status: "ACTIVE",
            },
            include: {
                student: {
                    include: {
                        user: true,
                    },
                },
            },
        }).then((enrollments) => enrollments.map((e) => ({
            ...e.student,
            enrollmentId: e.id, // useful for status updates
        })));
    }
    static async getStudentFullDetails(studentId) {
        return prisma_1.default.student.findUnique({
            where: { id: studentId },
            include: {
                user: true,
                enrollments: {
                    include: {
                        course: true,
                        academicRecords: true,
                    },
                    orderBy: {
                        startedAt: "desc",
                    },
                },
            },
        });
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
            include: { enrollment: { include: { student: { include: { user: true } },
                        course: true }
                }
            },
        });
    }
    // Fetch all students
    static async getAllStudentsWithPagination(page, limit, search) {
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
    static async getAllStudents() {
        return prisma_1.default.student.findMany({
            where: {
                user: {
                    isActive: true, // ← This filters only active students  
                }
            },
            include: {
                user: true,
                enrollments: true,
            },
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