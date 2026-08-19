import { api } from "@/lib/api";
import { handleRoute } from "@/lib/route";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  };

  return handleRoute(async () => {
    const data = await api.register(body);
    const session = await getSession();
    session.token = data.token;
    session.user = data.user;
    await session.save();
    return { user: data.user };
  }, "Registrasi berhasil");
}
