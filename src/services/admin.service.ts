// src/services/admin.service.ts
import { Role } from "@prisma/client";
import prisma from "../prisma";
import { hashPassword } from "../utils/hash";

export class AdminService {
  // Create another Admin
  static async createAdmin(serviceNumber: string, password: string, role: Role) {
    const hashed = await hashPassword(password);

    if (!Object.values(Role).includes(role)) {
      throw new Error("Invalid role");
    }

    const examOfficerExist = await prisma.user.findFirst({
      where: {role: Role.EXAM_OFFICER},
    });

    if(examOfficerExist) {
      throw new Error("Exam Officer already exists. Only one Exam Officer allowed.");
    }
    return prisma.user.create({
      data: {
        serviceNumber,
        password: hashed,
        role: role,
        isActive: true,
      },
    });
  }
  static async getExamOfficer() {
    return await prisma.user.findMany({
      where: { role: "EXAM_OFFICER" as Role},
      orderBy: {createdAt: "desc"}
    })
  };

  static async updateExamOfficer(id: number, data: any){
    return prisma.user.update({
       where: {id},
        data: {
          serviceNumber: data.serviceNumber,
        },
    });
  };

  static async deactivateExamOfficer(id: number, data: any){
    return prisma.user.update({
      where: {id},
      data: {isActive: data.isActive}
    })
  }

  // Create Student + linked User
static async createStudent(studentData: any) {
  // console.log("Received studentData:", JSON.stringify(studentData, null, 2)); // ← add this
  const { 
    serviceNumber, 
    password, 
    passportPhotoUrl, 
    // dateOfBirth, 
    enlistmentDate, 
    ...studentProfile  // ← now includes gender, firstName, etc.
  } = studentData;

  console.log("Spread studentProfile:", JSON.stringify(studentProfile, null, 2));

  const hashed = await hashPassword(password);

  // const birthDate = dateOfBirth ? new Date(dateOfBirth) : undefined;
  const enlistDate = enlistmentDate ? new Date(enlistmentDate) : undefined;

  // if (dateOfBirth && isNaN(birthDate!.getTime())) {
  //   throw new Error("Invalid dateOfBirth format. Use YYYY-MM-DD");
  // }
  if (enlistmentDate && isNaN(enlistDate!.getTime())) {
    throw new Error("Invalid enlistmentDate format. Use YYYY-MM-DD");
  }

  const user = await prisma.user.create({
    data: {
      serviceNumber,
      password: hashed,
      role: "STUDENT",
      isActive: true,
      student: {
        create: {
          ...studentProfile,          //
          passportPhotoUrl,
          // dateOfBirth: birthDate,
          enlistmentDate: enlistDate,
        },
      },
    },
    include: { student: true },
  });

  return user;
}
       

  // src/services/admin.service.ts
static async editStudent(studentId: number, studentData: any) {
  const { 
    // dateOfBirth, 
    enlistmentDate, 
    serviceNumber,        // ← extract it
    ...studentFields      // all other student fields
  } = studentData;

  // const birthDate = dateOfBirth ? new Date(dateOfBirth) : undefined;
  const enlistDate = enlistmentDate ? new Date(enlistmentDate) : undefined;

  // if (dateOfBirth && isNaN(birthDate!.getTime())) {
  //   throw new Error("Invalid dateOfBirth format. Use YYYY-MM-DD");
  // }
  if (enlistmentDate && isNaN(enlistDate!.getTime())) {
    throw new Error("Invalid enlistmentDate format. Use YYYY-MM-DD");
  }

  // First, get the student to know the linked userId
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { userId: true }
  });

  if (!student) throw new Error("Student not found");

  // Update both User and Student in a transaction
  return prisma.$transaction(async (tx) => {
    // Update serviceNumber in User (if provided)
    if (serviceNumber) {
      await tx.user.update({
        where: { id: student.userId },
        data: { serviceNumber },
      });
    }

    // Update Student fields
    return tx.student.update({
      where: { id: studentId },
      data: {
        ...studentFields,
        // dateOfBirth: birthDate,
        enlistmentDate: enlistDate,
      },
      include: { user: true },
    });
  });
}
  static async deleteStudent(studentId: number) {
    // Soft delete: set isActive = false on User, but keep Student record for history
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { user: true },
    });
    if (!student) throw new Error("Student not found");
    return prisma.user.update({
      where: { id: student.userId },
      data: { isActive: false },
    });
  }
  static async createStudents(studentData: any) {
    const { serviceNumber, password, passportPhotoUrl, ...profile } = studentData;
    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        serviceNumber,
        password: hashed,
        role: "STUDENT",
        isActive: true,
        student: {
          create: {...profile, passportPhotoUrl},
        },
      },
      include: { student: true },
    });

    return user;
  }

  // Create Course
  static async createCourse( code: string, title: string, duration: string, description?: string) {
    // Convert string → number
  const durationIntNumber = Number(duration);

  // Optional safety check
  if (isNaN(durationIntNumber) || durationIntNumber <= 0) {
    throw new Error("Duration must be a positive number");
  }
    return prisma.course.create({
      data: { code, title, duration: durationIntNumber, description },
    });
  }

  // get all courses
  static async getAllCourses(){
    return prisma.course.findMany(
      {where: {isDeleted: false}},
    );
  }

  static async getStudentsByCourse(courseId: number) {
  return prisma.enrollment.findMany({
    where: {
      courseId,
      status: "ACTIVE",
    },
    include: {
      student: {
        include: {
          user: true,
        },
      },
    },
  }).then((enrollments) =>
    enrollments.map((e) => ({
      ...e.student,
      enrollmentId: e.id, // useful for status updates
    }))
  );
}

static async getStudentFullDetails(studentId: number) {
  return prisma.student.findUnique({
    where: { id: studentId },
    include: {
      user: true,

      enrollments: {
        include: {
          course: true,
          academicRecords: true,
        },
        orderBy: {
          startedAt: "desc",
        },
      },

    },
  });
}

  // Soft delete Course
  static async deleteCourse(courseId: number) {
    return prisma.course.update({
      where: { id: courseId },
      data: { isDeleted: true },
    });
  }

  // Enroll student
  static async enrollStudent(studentId: number, courseId: number) {
    // Check ACTIVE enrollment
    const active = await prisma.enrollment.findFirst({
      where: { studentId, status: "ACTIVE" },
    });
    if (active) throw new Error("Student already has ACTIVE enrollment");

    return prisma.enrollment.create({
      data: {
        studentId,
        courseId,
        status: "ACTIVE",
        startedAt: new Date(),
      },
    });
  }

  static async getAllActiveEnrollment() {
    return prisma.enrollment.findMany({
      where: { status: "ACTIVE" },
      include: { course: true, student: { include: { user: true } } },
    });
  }

  // Get enrollments for a student
  static async getEnrollmentsByStudent(studentId: number) {
    return prisma.enrollment.findMany({
      where: { studentId, status: "ACTIVE" },
      include: { course: true },
    });
  }
  // Update Enrollment Status
  static async updateEnrollmentStatus(enrollmentId: number, status: "ACTIVE" | "COMPLETED" | "RTU") {
    const updateData: any = { status };
    if (status === "COMPLETED" || status === "RTU") updateData.completedAt = new Date();

    return prisma.enrollment.update({
      where: { id: enrollmentId },
      data: updateData,
    });
  }

  // Add Academic Record
  static async addAcademicRecord(enrollmentId: number, score: number, grade: string, remark?: string) {
    return prisma.academicRecord.create({
      data: {
        enrollmentId,
        score,
        grade,
        remark,
      },
    });
  }

  static async getAcademicRecordsByStudent(studentId: number) {
    return prisma.academicRecord.findMany({
      where: { enrollment: { studentId } },
      include: { enrollment: { include: { course: true } } },
    });
  }

  static async getAllAcademicRecords() {
    return prisma.academicRecord.findMany({
      include: { enrollment:
         { include:
           { student: {include: {user: true}},
            course: true } 
          } 
        },
    });
  }

  // Fetch all students
  static async getAllStudentsWithPagination( page: number, limit: number, search: string) {
    const whereCondition = {
      OR: [
        { firstName: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { lastName: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { user: { serviceNumber: { contains: search, mode: Prisma.QueryMode.insensitive } } },
      ],
    };
    const total = await prisma.student.count({
      where: whereCondition,
    });
    const students = await prisma.student.findMany({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
      include: { user: true, enrollments: true },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { 
      data:students, 
      total, 
      page, 
      totalPages: Math.ceil(total / limit), 
    };
  }

  static async getAllStudents() {
    return prisma.student.findMany({
      where: {
        user:{
         isActive: true,           // ← This filters only active students  
        }
      },
      include: {
        user: true,
        enrollments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Fetch single student
  static async getStudentById(id: number) {
    return prisma.student.findUnique({
      where: { id },
      include: { user: true, enrollments: { include: { course: true, academicRecords: true } } },
    });
  }
}