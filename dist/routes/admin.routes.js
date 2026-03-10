"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/admin.routes.ts
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const admin_service_1 = require("../services/admin.service");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const upload_1 = require("../utils/upload");
const student_validator_1 = require("../validators/student.validator");
const validator_1 = require("../middleware/validator");
const router = (0, express_1.Router)();
// Apply global middlewares to ALL admin routes
router.use(auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["ADMIN"]));
// Health check (publicly accessible for monitoring)
router.get("/health", (req, res) => {
    res.json({ status: "Admin routes are healthy!" });
});
// Admin user creation (usually only once or very restricted)
router.post("/create-admin", admin_controller_1.AdminController.createAdmin);
// Student CRUD
router.post("/students", upload_1.upload.single("passportPhoto"), (0, validator_1.validate)(student_validator_1.createStudentSchema, "body"), async (req, res) => {
    try {
        const studentData = { ...req.body };
        if (req.file) {
            studentData.passportPhotoUrl = `/uploads/${req.file.filename}`;
        }
        const student = await admin_service_1.AdminService.createStudent(studentData);
        res.status(201).json(student);
    }
    catch (err) {
        res.status(400).json({ message: err.message || "Failed to create student" });
    }
});
router.get("/students", (0, validator_1.validate)(student_validator_1.paginationSchema, "query"), admin_controller_1.AdminController.getAllStudentsWithPagination);
router.get("/students/all", admin_controller_1.AdminController.getAllStudents); // renamed from studentss → clearer
router.get("/students/:id", admin_controller_1.AdminController.getStudentById);
router.put("/students/:id", upload_1.upload.single("passportPhoto"), async (req, res) => {
    try {
        const studentData = { ...req.body };
        if (req.file) {
            studentData.passportPhotoUrl = `/uploads/${req.file.filename}`;
        }
        const { id } = req.params;
        const updatedStudent = await admin_service_1.AdminService.editStudent(Number(id), studentData);
        res.json(updatedStudent);
    }
    catch (err) {
        res.status(400).json({ message: err.message || "Failed to update student" });
    }
});
router.delete("/students/:id", admin_controller_1.AdminController.deleteStudent);
// Course CRUD
router.post("/courses", admin_controller_1.AdminController.createCourse);
router.get("/courses", admin_controller_1.AdminController.getAllCourses);
router.delete("/courses/:id", admin_controller_1.AdminController.deleteCourse);
// Enrollment routes
router.post("/enroll", admin_controller_1.AdminController.enrollStudent);
router.get("/enrollments/active", admin_controller_1.AdminController.getAllActiveEnrollment);
router.get("/enrollments/student/:studentId", admin_controller_1.AdminController.getEnrollmentsByStudent);
router.patch("/enroll/status", admin_controller_1.AdminController.updateEnrollmentStatus);
// Academic Records
router.post("/academic-records", admin_controller_1.AdminController.addAcademicRecord);
router.get("/academic-records", admin_controller_1.AdminController.getAllAcademicRecords);
// 404 for unmatched admin sub-routes (optional but good practice)
router.use((req, res) => {
    res.status(404).json({ message: "Admin route not found" });
});
exports.default = router;
// // src/routes/admin.routes.ts
// import { Router, Response } from "express";
// import { Request } from "multer";
// import { AdminController } from "../controllers/admin.controller";
// import { AdminService } from "../services/admin.service";
// import { authMiddleware } from "../middleware/auth.middleware";
// import { roleMiddleware } from "../middleware/role.middleware";
// import { upload } from "../utils/upload";
// import { paginationSchema, createStudentSchema } from "../validators/student.validator";
// import { validate } from "../middleware/validator";
// const router = Router();
// // All routes protected and only for ADMIN
// router.use(authMiddleware, roleMiddleware(["ADMIN"]));
// router.post("/create-admin", AdminController.createAdmin);
// // Add import
// router.get('/health', (req: Request, res: Response) => {
//   res.json("Admin routes are healthy!");
// });
// // Replace student creation route with Multer
// // validate(createStudentSchema, "body"),
// router.post("/students", upload.single("passportPhoto"), async (req, res) => {
//   try {
//     const studentData = { ...req.body };
//     if (req.file) studentData.passportPhotoUrl = `/uploads/${req.file.filename}`;
//     const student = await AdminService.createStudent(studentData);
//     res.json(student);
//   } catch (err: any) {
//     res.status(400).json({ message: err.message });
//   }
// });
// // router.post("/students", AdminController.createStudent);
// // validate(paginationSchema, "query"),
// router.get("/students", AdminController.getAllStudentsWithPagination);
// router.get("/studentss", AdminController.getAllStudents);
// router.delete("/students/:id", AdminController.deleteStudent);
// router.put("/students/:id", upload.single("passportPhoto"), async (req, res) => {
//   try {
//     const studentData = { ...req.body };
//     if (req.file) studentData.passportPhotoUrl = `/uploads/${req.file.filename}`;
//     const { id } = req.params;
//     const updatedStudent = await AdminService.editStudent(Number(id), studentData);
//     res.json(updatedStudent);
//   } catch (err: any) {
//     res.status(400).json({ message: err.message });
//   }
// });
// router.get("/students/:id", AdminController.getStudentById);
// router.post("/courses", AdminController.createCourse);
// router.get("/courses", AdminController.getAllCourses);
// router.delete("/courses/:id", AdminController.deleteCourse);
// router.post("/enroll", AdminController.enrollStudent);
// router.get("/enrollments/active", AdminController.getAllActiveEnrollment);
// router.get("/enrollments/student/:studentId", AdminController.getEnrollmentsByStudent);
// router.patch("/enroll/status", AdminController.updateEnrollmentStatus);
// router.post("/academic-records", AdminController.addAcademicRecord);
// router.get("/academic-records", AdminController.getAllAcademicRecords);
// export default router;
//# sourceMappingURL=admin.routes.js.map