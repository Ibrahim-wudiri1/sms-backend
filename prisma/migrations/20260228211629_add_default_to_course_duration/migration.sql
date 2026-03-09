-- AlterTable
-- Backfill existing rows with a value (only runs once)
-- UPDATE "Course"
-- SET "duration" = 4          
-- WHERE "duration" IS NULL;  

ALTER TABLE "Course" ADD COLUMN     "code" TEXT NOT NULL DEFAULT 'null 101',
ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 12;
