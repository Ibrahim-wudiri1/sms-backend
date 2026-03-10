// src/prisma.ts
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// ────────────────────────────────────────────────
//  Important: we create the pool and adapter only once
// ────────────────────────────────────────────────
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient;
  pgPool?: Pool;
  pgAdapter?: PrismaPg;
};

// Reuse pool & adapter across hot reloads (very important in development & Vercel)
if (!globalForPrisma.pgPool) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  globalForPrisma.pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Recommended settings for serverless / Vercel
    max: 20,                    // adjust based on your plan
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  });

  globalForPrisma.pgAdapter = new PrismaPg(globalForPrisma.pgPool);
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    adapter: globalForPrisma.pgAdapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  });
};

// ────────────────────────────────────────────────
//  Classic singleton pattern to avoid multiple instances
// ────────────────────────────────────────────────
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;

// import { PrismaClient } from '@prisma/client';
// import { Pool } from 'pg';                           // or mysql2, etc.
// import { PrismaPg } from '@prisma/adapter-pg';

// const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// const adapter = new PrismaPg(pool);

// // const prisma = new PrismaClient({ adapter });

// const prismaClientSingleton = () => {
//     return new PrismaClient({ 
//         log: ['query'], // Optional: Enable logging
//      });
// };

// declare global {
//     // Allow global `var` declarations
//     var prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
// }
// const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
// if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
// // Optional singleton wrapper as above...
// export default prisma;