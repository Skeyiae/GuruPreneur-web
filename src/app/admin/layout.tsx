import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ADMIN_EMAILS = ["admin@gmail.com", "beltanbeltan60@gmail.com"];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const email = user.emailAddresses[0]?.emailAddress;

  if (!email || !ADMIN_EMAILS.includes(email)) {
    redirect("/");
  }

  return <>{children}</>;
}
