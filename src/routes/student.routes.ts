// src/routes/student.routes.ts
import { Router } from "express";
import { StudentController } from "../controllers/student.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

const router = Router();

// All routes protected for STUDENT only
router.use(authMiddleware, roleMiddleware(["STUDENT"]));

router.get("/profile", StudentController.getProfile);
router.get("/enrollments", StudentController.getEnrollments);

export default router;