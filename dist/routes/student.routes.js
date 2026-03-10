"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/student.routes.ts
const express_1 = require("express");
const student_controller_1 = require("../controllers/student.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const router = (0, express_1.Router)();
// All routes protected for STUDENT only
router.use(auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["STUDENT"]));
router.get("/profile", student_controller_1.StudentController.getProfile);
router.get("/enrollments", student_controller_1.StudentController.getEnrollments);
exports.default = router;
//# sourceMappingURL=student.routes.js.map