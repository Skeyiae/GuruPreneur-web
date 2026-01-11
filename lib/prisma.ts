// @ts-nocheck
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const url = process.env.guru_preneur_PRISMA_DATABASE_URL
    ?? process.env.PRISMA_DATABASE_URL
    ?? process.env.guru_preneur_POSTGRES_URL
    ?? process.env.POSTGRES_PRISMA_URL
    ?? process.env.DATABASE_URL;

if (!url) {
    throw new Error("❌ FATAL: No database connection string found in environment variables.");
}

// Prisma 7 with Accelerate uses accelerateUrl
const prisma = new PrismaClient({
    accelerateUrl: url,
});

export { prisma }