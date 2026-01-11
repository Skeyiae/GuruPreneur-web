// ...existing code...
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
// ...existing code...
const prisma = new PrismaClient();

export { prisma }