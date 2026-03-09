import { ZodSchema } from "zod";
import {Request, Response, NextFunction} from "express";

export const validate = (schema: ZodSchema<any>, type: "body" | "query" | "params" = "body")=>
(req: Request, res: Response, next: NextFunction) => {
    try {
        const result = schema.parse(req[type]);
        req[type] = result;
        next();
    } catch (error: any) {
        return res.status(400).json({
            message: "Validation failed",
            errors: error.errors,
            
        });
    }
}