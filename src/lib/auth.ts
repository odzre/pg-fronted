import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import type { User } from "@/lib/types";

export async function requireUser(): Promise<User> {
  const session = await getSession();

  if (!session.token || !session.user) {
    redirect("/login");
  }

  return session.user;
}
