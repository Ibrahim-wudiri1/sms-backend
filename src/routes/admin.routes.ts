// src/routes/admin.routes.ts
import { Router, Request, Response } from "express";
import { AdminController } from "../controllers/admin.controller";
import { AdminService } from "../services/admin.service";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { upload } from "../utils/upload";
import { paginationSchema, createStudentSchema } from "../validators/student.validator";
import { validate } from "../middleware/validator";


const router = Router();

// All routes protected and only for ADMIN
router.use(authMiddleware, roleMiddleware(["ADMIN"]));

router.post("/create-admin", AdminController.createAdmin);
// Add import
router.get('/health', (req: Request, res: Response) => {
  res.json("Admin routes are healthy!");
});

// Replace student creation route with Multer
// validate(createStudentSchema, "body"),
router.post("/students", upload.single("passportPhoto"), async (req, res) => {
  try {
    const studentData = { ...req.body };
    if (req.file) studentData.passportPhotoUrl = `/uploads/${req.file.filename}`;

    const student = await AdminService.createStudent(studentData);
    res.json(student);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});
// router.post("/students", AdminController.createStudent);
// validate(paginationSchema, "query"),
router.get("/students", AdminController.getAllStudentsWithPagination);
router.get("/studentss", AdminController.getAllStudents);
router.delete("/students/:id", AdminController.deleteStudent);
router.put("/students/:id", upload.single("passportPhoto"), async (req, res) => {
  try {
    const studentData = { ...req.body };
    if (req.file) studentData.passportPhotoUrl = `/uploads/${req.file.filename}`;
    const { id } = req.params;
    const updatedStudent = await AdminService.editStudent(Number(id), studentData);
    res.json(updatedStudent);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});
router.get("/students/:id", AdminController.getStudentById);

router.post("/courses", AdminController.createCourse);
router.get("/courses", AdminController.getAllCourses);
router.delete("/courses/:id", AdminController.deleteCourse);

router.post("/enroll", AdminController.enrollStudent);
router.get("/enrollments/active", AdminController.getAllActiveEnrollment);
router.get("/enrollments/student/:studentId", AdminController.getEnrollmentsByStudent);
router.patch("/enroll/status", AdminController.updateEnrollmentStatus);

router.post("/academic-records", AdminController.addAcademicRecord);
router.get("/academic-records", AdminController.getAllAcademicRecords);

export default router;