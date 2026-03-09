-- Direct cast (PostgreSQL will truncate time part automatically)
ALTER TABLE "Student" 
ALTER COLUMN "dateOfBirth" TYPE DATE USING ("dateOfBirth"::DATE);