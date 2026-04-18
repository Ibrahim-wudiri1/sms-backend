"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const admin_service_1 = require("../services/admin.service");
// import { data } from "react-router-dom";
class AdminController {
    static async createAdmin(req, res) {
        try {
            const { serviceNumber, password, role } = req.body;
            const admin = await admin_service_1.AdminService.createAdmin(serviceNumber, password, role);
            res.json(admin);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    static async getExamOfficer(req, res) {
        try {
            const examOfficer = await admin_service_1.AdminService.getExamOfficer();
            res.json(examOfficer);
        }
        catch (err) {
            console.error("Getting ExamOfficer Error: ", err.message);
            res.status(400).json({ message: err.message });
        }
    }
    static async updateExamOfficer(req, res) {
        try {
            const { id } = req.params;
            const updated = await admin_service_1.AdminService.updateExamOfficer(Number(id), req.body);
            res.json(updated);
        }
        catch (err) {
            console.error("Updated ExamOfficer Error: ", err.message);
            res.status(400).json({ message: err.message });
        }
    }
    static async deactivateExamOfficer(req, res) {
        try {
            const { id } = req.params;
            const result = await admin_service_1.AdminService.deactivateExamOfficer(Number(id), req.body);
            res.json(result);
        }
        catch (err) {
            console.error("Error deactivating officer: ", err.message);
            res.status(400).json({ message: err.message });
        }
    }
    static async createStudent(req, res) {
        try {
            console.log("Student Data: ", JSON.stringify(req.body, null, 2));
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
            console.log("Student Update Data: ", JSON.stringify(req.body, null, 2));
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
    static async getStudentsByCourse(req, res) {
        try {
            const { id } = req.params;
            const students = await admin_service_1.AdminService.getStudentsByCourse(Number(id));
            res.json(students);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    static async getStudentFullDetails(req, res) {
        try {
            const { id } = req.params;
            const studentDetails = await admin_service_1.AdminService.getStudentFullDetails(Number(id));
            res.json(studentDetails);
        }
        catch (err) {
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
            console.log("Enrollment data: ", req.body);
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
            const { enrollmentId } = req.params;
            const { status } = req.body;
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
            // console.log("Academic Records: ", records);
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
            const result = await admin_service_1.AdminService.getAllStudentsWithPagination(page, limit, search);
            res.json(result);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    static async getAllStudents(req, res) {
        try {
            const students = await admin_service_1.AdminService.getAllStudents();
            // console.log("Fetched students: ", JSON.stringify(students, null, 2));
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