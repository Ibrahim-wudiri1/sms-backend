"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStudentSchema = exports.paginationSchema = void 0;
const zod_1 = require("zod");
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : 1))
        .refine((val) => val > 0, {
        message: "Page must be greater than 0",
    }),
    limit: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : 10))
        .refine((val) => val > 0 && val <= 100, {
        message: "Limit must be between 1 and 100",
    }),
    search: zod_1.z.string().optional().default(""),
});
exports.createStudentSchema = zod_1.z.object({
    serviceNumber: zod_1.z.string().min(3),
    password: zod_1.z.string().min(6),
    firstName: zod_1.z.string().min(2),
    lastName: zod_1.z.string().min(2),
    rank: zod_1.z.string(),
    batch: zod_1.z.string(),
    unit: zod_1.z.string(),
    phone: zod_1.z.string(),
    email: zod_1.z.string().email(),
});
//# sourceMappingURL=student.validator.js.map