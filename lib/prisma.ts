// ...existing code...
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
// ...existing code...
const url = process.env.guru_preneur_PRISMA_DATABASE_URL
    ?? process.env.PRISMA_DATABASE_URL
    ?? process.env.guru_preneur_POSTGRES_URL
    ?? process.env.POSTGRES_PRISMA_URL
    ?? process.env.DATABASE_URL
    ?? "";

const prisma = new PrismaClient({
    datasources: {
        db: {
            url,
        },
    },
});

export { prisma }