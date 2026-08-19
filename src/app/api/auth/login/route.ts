import { api } from "@/lib/api";
import { handleRoute } from "@/lib/route";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  const body = (await req.json()) as { email: string; password: string };

  return handleRoute(async () => {
    const data = await api.login(body);
    const session = await getSession();
    session.token = data.token;
    session.user = data.user;
    await session.save();
    return { user: data.user };
  }, "Login berhasil");
}
