// src/utils/upload.ts
import multer from "multer";

const storage = multer.memoryStorage(); // ← crucial change: keep file in memory only

const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Invalid file type. Only JPEG, PNG allowed."), false);
  }
  cb(null, true);
};

const pdfFileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype !== "application/pdf") {
    return cb(new Error("Invalid file type. Only PDF allowed."), false);
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter,
});

export const certificateUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for PDFs
  fileFilter: pdfFileFilter,
});