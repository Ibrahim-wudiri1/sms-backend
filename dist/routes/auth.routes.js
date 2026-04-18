"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.routes.ts
const express_1 = __importDefault(require("express"));
const express_2 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_2.Router)();
router.post("/login", express_1.default.json(), auth_controller_1.AuthController.login);
router.post("/refresh", express_1.default.json(), auth_controller_1.AuthController.refresh);
router.post("/logout", auth_controller_1.AuthController.logout);
router.post("/change-password", express_1.default.json(), auth_middleware_1.authMiddleware, auth_controller_1.AuthController.changePassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map