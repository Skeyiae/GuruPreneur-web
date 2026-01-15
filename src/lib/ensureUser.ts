import { prisma } from "@/../lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function ensureUser() {
  const { userId } = auth();

  if (!userId) throw new Error("UNAUTHORIZED");

  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        role: "USER",
      },
    });
  }

  return user;
}
