"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const pg_1 = require("pg"); // or mysql2, etc.
const adapter_pg_1 = require("@prisma/adapter-pg");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
// const prisma = new PrismaClient({ adapter });
const prismaClientSingleton = () => {
    return new client_1.PrismaClient({
        log: ['query'], // Optional: Enable logging
    });
};
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
if (process.env.NODE_ENV !== 'production')
    globalThis.prismaGlobal = prisma;
// Optional singleton wrapper as above...
exports.default = prisma;
//# sourceMappingURL=prisma.js.map