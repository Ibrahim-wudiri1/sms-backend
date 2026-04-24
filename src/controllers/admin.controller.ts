// src/controllers/admin.controller.ts
import { Request, Response } from "express";
import { AdminService } from "../services/admin.service";
import { supabaseAdmin } from "../utils/supabase";
// import { data } from "react-router-dom";

export class AdminController {
  static async createAdmin(req: Request, res: Response) {
    try {
      const { serviceNumber, password, role } = req.body;
      const admin = await AdminService.createAdmin(serviceNumber, password, role);
      res.json(admin);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getExamOfficer(req: Request, res: Response){
    try{
      const examOfficer = await AdminService.getExamOfficer();
      res.json(examOfficer);
    } catch (err: any){
      console.error("Getting ExamOfficer Error: ", err.message);
      res.status(400).json({message: err.message});
    }
  }

  static async updateExamOfficer(req: Request, res: Response){
    try{
      const {id} = req.params;
      const updated = await AdminService.updateExamOfficer(Number(id), req.body);
      res.json(updated);
    } catch(err: any){
      console.error("Updated ExamOfficer Error: ", err.message);
      res.status(400).json({message: err.message});
    }
  }

  static async deactivateExamOfficer(req: Request, res: Response){
    try{
      const {id} = req.params;
      const result = await AdminService.deactivateExamOfficer(Number(id), req.body);
      res.json(result);
    }  catch(err: any){
      console.error("Error deactivating officer: ", err.message);
      res.status(400).json({message: err.message});
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
      console.log("Student Update Data: ", JSON.stringify(req.body, null, 2));
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

  static async getStudentsByCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const students = await AdminService.getStudentsByCourse(Number(id));
      res.json(students);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getStudentFullDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const studentDetails = await AdminService.getStudentFullDetails(Number(id));
      res.json(studentDetails);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
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
      console.log("Enrollment data: ", req.body);
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
      const {enrollmentId} = req.params;
      const { status } = req.body;

      // If marking as COMPLETED, check for certificate
      if (status === "COMPLETED") {
        const hasCertificate = await AdminService.hasCertificate(Number(enrollmentId));
        if (!hasCertificate) {
          return res.status(400).json({
            message:
              "Cannot mark course as completed. Certificate PDF not uploaded. Please upload the certificate before marking as completed.",
          });
        }
      }

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
      // console.log("Academic Records: ", records);
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
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const search = req.query.search ? String(req.query.search) : "";
    try {
      const result = await AdminService.getAllStudentsWithPagination(page, limit, search);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getAllStudents(req: Request, res: Response) {
    
    try {
      const students = await AdminService.getAllStudents();
      // console.log("Fetched students: ", JSON.stringify(students, null, 2));
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

  static async updateCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await AdminService.updateCourse(Number(id), req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async uploadCertificate(req: any, res: Response) {
    try {
      const { enrollmentId } = req.params;

      if (!req.file) {
        return res.status(400).json({ message: "No file provided" });
      }

      // Upload to Supabase Storage
      const file = req.file;
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `certificates/${fileName}`;

      const { data, error } = await supabaseAdmin.storage
        .from('certificates')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        console.error('Certificate upload error:', error);
        return res.status(400).json({ message: `Failed to upload certificate: ${error.message}` });
      }

      // Generate a signed URL (valid for 7 days)
      // why 7 days not forever
      const { data: signedUrlData, error: signedError } = await supabaseAdmin.storage
        .from('certificates')
        .createSignedUrl(filePath, 60 * 60 * 24 * 7);

      if (signedError || !signedUrlData) {
        return res.status(400).json({ message: 'Failed to generate signed URL' });
      }

      const fileUrl = signedUrlData.signedUrl;
      const certificate = await AdminService.uploadCertificate(Number(enrollmentId), fileUrl, file.originalname);
      
      res.status(201).json({
        ...certificate,
        fileUrl,
        fileName: file.originalname,
      });
    } catch (err: any) {
      console.error('Certificate upload error:', err);
      res.status(400).json({ message: err.message });
    }
  }

  static async getCertificate(req: Request, res: Response) {
    try {
      const { enrollmentId } = req.params;
      const certificate = await AdminService.getCertificate(Number(enrollmentId));

      if (!certificate) {
        return res.status(404).json({ message: "Certificate not found" });
      }

      res.json(certificate);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async deleteCertificate(req: Request, res: Response) {
    try {
      const { enrollmentId } = req.params;
      const deleted = await AdminService.deleteCertificate(Number(enrollmentId));
      res.json(deleted);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}