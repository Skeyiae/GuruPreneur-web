import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        // Priority: 1. Custom Accelerate (guru_preneur) 2. Vercel Accelerate 3. Custom Pooling 4. Vercel Pooling 5. Local
        url: process.env.guru_preneur_PRISMA_DATABASE_URL ?? process.env.PRISMA_DATABASE_URL ?? process.env.guru_preneur_POSTGRES_URL ?? process.env.POSTGRES_PRISMA_URL ?? process.env.DATABASE_URL ?? "",
    },
    // If you need directUrl for migrations (often automatically handled or separate config)
    // For Vercel Postgres, usually just the pooled URL for app, or non-pooled for migration.
    // Prisma 7 config might just take `url`.
});
