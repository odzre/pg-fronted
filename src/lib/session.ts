import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import type { User } from "@/lib/types";

export interface SessionData {
  token?: string;
  user?: User;
}

export const sessionOptions: SessionOptions = {
  cookieName: "pg_session",
  password: process.env.SESSION_SECRET ?? "dev-only-secret-please-change-32-chars",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}
