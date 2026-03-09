import { z } from "zod";

export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 1))
    .refine((val) => val > 0, {
      message: "Page must be greater than 0",
    }),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 10))
    .refine((val) => val > 0 && val <= 100, {
      message: "Limit must be between 1 and 100",
    }),

  search: z.string().optional().default(""),
});

export const createStudentSchema = z.object({
  serviceNumber: z.string().min(3),
  password: z.string().min(6),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  rank: z.string(),
  batch: z.string(),
  unit: z.string(),
  phone: z.string(),
  email: z.string().email(),
});