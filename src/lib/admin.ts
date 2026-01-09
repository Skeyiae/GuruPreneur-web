import { auth, clerkClient } from "@clerk/nextjs/server";

const ADMIN_EMAILS = [
  "admin@gmail.com",
  "beltanbeltan60@gmail.com",
];

export async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) throw new Error("UNAUTHORIZED");

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const email = user.primaryEmailAddress?.emailAddress;

  if (!email || !ADMIN_EMAILS.includes(email)) {
    throw new Error("FORBIDDEN");
  }

  return user;
}
