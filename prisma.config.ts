import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        url: process.env.POSTGRES_PRISMA_URL ?? process.env.DATABASE_URL ?? "",
    },
    // If you need directUrl for migrations (often automatically handled or separate config)
    // For Vercel Postgres, usually just the pooled URL for app, or non-pooled for migration.
    // Prisma 7 config might just take `url`.
});
