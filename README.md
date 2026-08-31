# SMS Backend

Small Admin/Student Management backend (Express + Prisma + Postgres).

## Overview
- Language: TypeScript
- Framework: Express
- ORM: Prisma
- Database: PostgreSQL (Supabase recommended)

This service exposes admin and student APIs used by the `sms` frontend.

## Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (or Supabase project)
- `DATABASE_URL` and `DIRECT_URL` environment variables configured

## Quickstart (local)
1. Install dependencies

```bash
cd sms-backend
npm install
```

2. Create a `.env` file using `.env.example` (if present) and set `DATABASE_URL`.

3. Generate Prisma client (after schema edits)

```bash
npx prisma generate
```

4. Create & apply local migration (development only):

```bash
npx prisma migrate dev --name init
```

5. Run the server in development

```bash
npm run dev
```

## Running migrations for production
See `../docs/MIGRATIONS.md` for safe production migration and baselining steps.

## Important endpoints (Admin)
- `POST /admin/courses` — create course
- `GET /admin/courses` — list courses
- `POST /admin/courses/:courseId/years` — create a CourseYear (admin only)
- `GET /admin/courses/:courseId/years` — list years for a course (admin only)
- `DELETE /admin/courses/years/:yearId` — delete (soft) a course year
- `GET /admin/courses/:courseId/years/:yearId/students` — list active students for a course and year
- `POST /admin/enroll` — enroll a student (payload supports `courseYearId`)
- Other existing admin/student endpoints remain unchanged (students CRUD, enrollment status, certificates)

## Developer notes
- Prisma schema: `prisma/schema.prisma`
- Migrations: `prisma/migrations`
- Prisma client is imported from `src/prisma.ts`

## Troubleshooting
- If `npx prisma generate` fails on CI with schema errors, verify `prisma/schema.prisma` and ensure environment variables are set.
- For `P3005` errors (non-empty DB), follow the baselining steps in `../docs/MIGRATIONS.md`.

## Contact
For questions about backend internals, check `sms-backend/src/services` and `sms-backend/src/controllers` files for logic and examples.
