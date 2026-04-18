"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/prisma.ts
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
// ────────────────────────────────────────────────
//  Important: we create the pool and adapter only once
// ────────────────────────────────────────────────
const globalForPrisma = globalThis;
// Reuse pool & adapter across hot reloads (very important in development & Vercel)
if (!globalForPrisma.pgPool) {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is not set');
    }
    globalForPrisma.pgPool = new pg_1.Pool({
        connectionString: process.env.DATABASE_URL,
        // Recommended settings for serverless / Vercel
        max: 20, // adjust based on your plan
        connectionTimeoutMillis: 7000,
        idleTimeoutMillis: 50000,
    });
    globalForPrisma.pgAdapter = new adapter_pg_1.PrismaPg(globalForPrisma.pgPool);
}
const prismaClientSingleton = () => {
    return new client_1.PrismaClient({
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
exports.default = prisma;
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
//# sourceMappingURL=prisma.js.map