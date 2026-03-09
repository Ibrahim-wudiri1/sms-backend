import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';                           // or mysql2, etc.
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

const prismaClientSingleton = () => {
    return new PrismaClient({ 
        log: ['query'], // Optional: Enable logging
     });
};

declare global {
    // Allow global `var` declarations
    var prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
}
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
// Optional singleton wrapper as above...
export default prisma;