// src/routes/admin.routes.ts
import { Router, Request, Response } from "express";
import { AdminController } from "../controllers/admin.controller";
import { AdminService } from "../services/admin.service";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { upload } from "../utils/upload";
import { paginationSchema, createStudentSchema } from "../validators/student.validator";
import { validate } from "../middleware/validator";

// Extend Request type locally (if you don't have global express.d.ts yet)
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const router = Router();

// Apply global middlewares to ALL admin routes
// router.use(authMiddleware, roleMiddleware(["ADMIN"]));

// Health check (publicly accessible for monitoring)
router.get("/health", (req: Request, res: Response) => {
  res.json({ status: "Admin routes are healthy!" });
});

// Admin user creation (usually only once or very restricted)
router.post("/create-admin", AdminController.createAdmin);

// Student CRUD
router.post(
  "/students",
  upload.single("passportPhoto"),
  validate(createStudentSchema, "body"),
  async (req: MulterRequest, res: Response) => {
    try {
      const studentData = { ...req.body };
      if (req.file) {
        studentData.passportPhotoUrl = `/uploads/${req.file.filename}`;
      }

      const student = await AdminService.createStudent(studentData);
      res.status(201).json(student);
    } catch (err: any) {
      res.status(400).json({ message: err.message || "Failed to create student" });
    }
  }
);

router.get(
  "/students",
  validate(paginationSchema, "query"),
  AdminController.getAllStudentsWithPagination
);

router.get("/students/all", AdminController.getAllStudents); // renamed from studentss → clearer

router.get("/students/:id", AdminController.getStudentById);

router.put(
  "/students/:id",
  upload.single("passportPhoto"),
  async (req: MulterRequest & { params: { id: string } }, res: Response) => {
    try {
      const studentData = { ...req.body };
      if (req.file) {
        studentData.passportPhotoUrl = `/uploads/${req.file.filename}`;
      }
      const { id } = req.params;
      const updatedStudent = await AdminService.editStudent(Number(id), studentData);
      res.json(updatedStudent);
    } catch (err: any) {
      res.status(400).json({ message: err.message || "Failed to update student" });
    }
  }
);

router.delete("/students/:id", AdminController.deleteStudent);

// Course CRUD
router.post("/courses", AdminController.createCourse);
router.get("/courses", AdminController.getAllCourses);
router.delete("/courses/:id", AdminController.deleteCourse);

// Enrollment routes
router.post("/enroll", AdminController.enrollStudent);
router.get("/enrollments/active", AdminController.getAllActiveEnrollment);
router.get("/enrollments/student/:studentId", AdminController.getEnrollmentsByStudent);
router.patch("/enroll/status", AdminController.updateEnrollmentStatus);

// Academic Records
router.post("/academic-records", AdminController.addAcademicRecord);
router.get("/academic-records", AdminController.getAllAcademicRecords);

// 404 for unmatched admin sub-routes (optional but good practice)
router.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Admin route not found" });
});

export default router;

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