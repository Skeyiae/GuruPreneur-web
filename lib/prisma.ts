// @ts-nocheck
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const url = process.env.guru_preneur_PRISMA_DATABASE_URL
    ?? process.env.PRISMA_DATABASE_URL
    ?? process.env.guru_preneur_POSTGRES_URL
    ?? process.env.POSTGRES_PRISMA_URL
    ?? process.env.DATABASE_URL;

console.log("DEBUG: Checking Env Vars for Prisma:");
console.log("guru_preneur_PRISMA_DATABASE_URL:", !!process.env.guru_preneur_PRISMA_DATABASE_URL);
console.log("PRISMA_DATABASE_URL:", !!process.env.PRISMA_DATABASE_URL);
console.log("guru_preneur_POSTGRES_URL:", !!process.env.guru_preneur_POSTGRES_URL);
console.log("POSTGRES_PRISMA_URL:", !!process.env.POSTGRES_PRISMA_URL);
console.log("DATABASE_URL:", !!process.env.DATABASE_URL);
console.log("Resolved URL length:", url ? url.length : 0);

if (!url) {
    throw new Error("❌ FATAL: No database connection string found in environment variables. Please check Vercel Settings.");
}

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: url,
        },
    },
});

export { prisma }