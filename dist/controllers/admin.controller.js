"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const admin_service_1 = require("../services/admin.service");
class AdminController {
    static async createAdmin(req, res) {
        try {
            const { serviceNumber, password } = req.body;
            const admin = await admin_service_1.AdminService.createAdmin(serviceNumber, password);
            res.json(admin);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    static async createStudent(req, res) {
        try {
            const student = await admin_service_1.AdminService.createStudent(req.body);
            res.json(student);
        }
        catch (err) {
            console.log("Error: ", err.message);
            res.status(400).json({ message: err.message });
        }
    }
    static async editStudent(req, res) {
        try {
            const { id } = req.params;
            const updatedStudent = await admin_service_1.AdminService.editStudent(Number(id), req.body);
            res.json(updatedStudent);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    static async createCourse(req, res) {
        try {
            const { code, title, duration, description } = req.body;
            const course = await admin_service_1.AdminService.createCourse(code, title, duration, description);
            res.json(course);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    static async getAllCourses(req, res) {
        try {
            const courses = await admin_service_1.AdminService.getAllCourses();
            res.json(courses);
        }
        catch (err) {
            console.error("Error fetching courses:", err);
            res.status(400).json({ message: err.message });
        }
    }
    static async deleteCourse(req, res) {
        try {
            const { id } = req.params;
            const course = await admin_service_1.AdminService.deleteCourse(Number(id));
            res.json(course);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    static async enrollStudent(req, res) {
        try {
            const { studentId, courseId } = req.body;
            const enrollment = await admin_service_1.AdminService.enrollStudent(Number(studentId), Number(courseId));
            res.json(enrollment);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    static async getAllActiveEnrollment(req, res) {
        try {
            const enrollments = await admin_service_1.AdminService.getAllActiveEnrollment();
            res.json(enrollments);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    static async getEnrollmentsByStudent(req, res) {
        try {
            const { studentId } = req.params;
            const enrollments = await admin_service_1.AdminService.getEnrollmentsByStudent(Number(studentId));
            res.json(enrollments);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    static async updateEnrollmentStatus(req, res) {
        try {
            const { enrollmentId, status } = req.body;
            const updated = await admin_service_1.AdminService.updateEnrollmentStatus(Number(enrollmentId), status);
            res.json(updated);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    static async addAcademicRecord(req, res) {
        try {
            const { enrollmentId, score, grade, remark } = req.body;
            const scoreNum = Number(score);
            if (isNaN(scoreNum)) {
                throw new Error("Invalid score value");
            }
            const record = await admin_service_1.AdminService.addAcademicRecord(Number(enrollmentId), scoreNum, grade, remark);
            res.json(record);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    static async getAllAcademicRecords(req, res) {
        try {
            const records = await admin_service_1.AdminService.getAllAcademicRecords();
            res.json(records);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    static async getAcademicRecordsByStudent(req, res) {
        try {
            const { studentId } = req.params;
            const records = await admin_service_1.AdminService.getAcademicRecordsByStudent(Number(studentId));
            res.json(records);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    static async getAllStudentsWithPagination(req, res) {
        const page = req.params.page ? Number(req.params.page) : 1;
        const limit = req.params.limit ? Number(req.params.limit) : 10;
        const offset = (page - 1) * limit;
        const search = req.query.search ? String(req.query.search) : "";
        try {
            const result = await admin_service_1.AdminService.getAllStudents(page, limit, search);
            res.json(result);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    static async getAllStudents(req, res) {
        try {
            const students = await admin_service_1.AdminService.getAllStudentss();
            res.json(students);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    static async deleteStudent(req, res) {
        try {
            const { id } = req.params;
            const deletedStudent = await admin_service_1.AdminService.deleteStudent(Number(id));
            res.json(deletedStudent);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    static async getStudentById(req, res) {
        try {
            const { id } = req.params;
            const student = await admin_service_1.AdminService.getStudentById(Number(id));
            res.json(student);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map