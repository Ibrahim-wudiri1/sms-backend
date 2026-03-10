// express.d.ts
import { Request } from 'express';
import { Multer } from 'multer';

declare module 'express-serve-static-core' {
  interface Request {
    file?: Express.Multer.File;          // for upload.single()
    files?: Express.Multer.File[] | Express.Multer.File[][];  // for upload.array() or fields()
  }
}