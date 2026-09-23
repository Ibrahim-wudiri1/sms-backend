-- Add EnrollmentDocument table

CREATE TABLE "EnrollmentDocument" (
    "id" SERIAL NOT NULL,
    "enrollmentId" INTEGER NOT NULL,
    "courseReportUrl" TEXT,
    "courseReportName" TEXT,
    "resultSheetUrl" TEXT,
    "resultSheetName" TEXT,
    "ab197Url" TEXT,
    "ab197Name" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnrollmentDocument_pkey" PRIMARY KEY ("id")
);

-- Unique index on enrollmentId
CREATE UNIQUE INDEX "EnrollmentDocument_enrollmentId_key" ON "EnrollmentDocument"("enrollmentId");

-- Index
CREATE INDEX "EnrollmentDocument_enrollmentId_idx" ON "EnrollmentDocument"("enrollmentId");

-- Foreign key
ALTER TABLE "EnrollmentDocument" ADD CONSTRAINT "EnrollmentDocument_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
