// src/controllers/admin.controller.ts
import { Request, Response } from "express";
import { AdminService } from "../services/admin.service";
// import { data } from "react-router-dom";

export class AdminController {
  static async createAdmin(req: Request, res: Response) {
    try {
      const { serviceNumber, password } = req.body;
      const admin = await AdminService.createAdmin(serviceNumber, password);
      res.json(admin);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async createStudent(req: Request, res: Response) {
    try {
      console.log("Student Data: ", JSON.stringify(req.body, null, 2));
      const student = await AdminService.createStudent(req.body);
      res.json(student);
    } catch (err: any) {
      console.log("Error: ", err.message);
      res.status(400).json({ message: err.message });
    }
  }

  static async editStudent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedStudent = await AdminService.editStudent(Number(id), req.body);
      res.json(updatedStudent);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async createCourse(req: Request, res: Response) {
    try {
      const { code, title, duration, description } = req.body;
      const course = await AdminService.createCourse(code, title, duration, description);
      res.json(course);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getAllCourses(req: Request, res: Response){
    try{
      const courses = await AdminService.getAllCourses();
      res.json(courses);
    }catch(err: any){
      console.error("Error fetching courses:", err);
      res.status(400).json({message: err.message});
    }
  }

  static async deleteCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const course = await AdminService.deleteCourse(Number(id));
      res.json(course);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async enrollStudent(req: Request, res: Response) {
    try {
      const { studentId, courseId } = req.body;
      const enrollment = await AdminService.enrollStudent(Number(studentId), Number(courseId));
      res.json(enrollment);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getAllActiveEnrollment(req: Request, res: Response) {
    try {
      const enrollments = await AdminService.getAllActiveEnrollment();
      res.json(enrollments);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getEnrollmentsByStudent(req: Request, res: Response) {
    try {
      const { studentId } = req.params;
      const enrollments = await AdminService.getEnrollmentsByStudent(Number(studentId));
      res.json(enrollments);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async updateEnrollmentStatus(req: Request, res: Response) {
    try {
      const { enrollmentId, status } = req.body;
      const updated = await AdminService.updateEnrollmentStatus(Number(enrollmentId), status);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async addAcademicRecord(req: Request, res: Response) {
    try {
      const { enrollmentId, score, grade, remark } = req.body;
      const scoreNum = Number(score); 
      if (isNaN(scoreNum)) {
        throw new Error("Invalid score value");
      }
      const record = await AdminService.addAcademicRecord(Number(enrollmentId), scoreNum, grade, remark);
      res.json(record);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getAllAcademicRecords(req: Request, res: Response) {
    try {
      const records = await AdminService.getAllAcademicRecords();
      res.json(records);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getAcademicRecordsByStudent(req: Request, res: Response) {
    try {
      const { studentId } = req.params;
      const records = await AdminService.getAcademicRecordsByStudent(Number(studentId));
      res.json(records);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getAllStudentsWithPagination(req: Request, res: Response) {
    const page = req.params.page ? Number(req.params.page) : 1;
    const limit = req.params.limit ? Number(req.params.limit) : 10;
    const offset = (page - 1) * limit;
    const search = req.query.search ? String(req.query.search) : "";
    try {
      const result = await AdminService.getAllStudents(page, limit, search);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getAllStudents(req: Request, res: Response) {
    try {
      const students = await AdminService.getAllStudentss();
      res.json(students);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async deleteStudent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deletedStudent = await AdminService.deleteStudent(Number(id));
      res.json(deletedStudent);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getStudentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const student = await AdminService.getStudentById(Number(id));
      res.json(student);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}