"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
// src/utils/upload.ts
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage(); // ← crucial change: keep file in memory only
const fileFilter = (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Invalid file type. Only JPEG, PNG allowed."), false);
    }
    cb(null, true);
};
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter,
});
//# sourceMappingURL=upload.js.map