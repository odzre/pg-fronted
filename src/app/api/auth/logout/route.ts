import { api } from "@/lib/api";
import { handleRoute } from "@/lib/route";
import { getSession } from "@/lib/session";

export async function POST() {
  return handleRoute(async () => {
    try {
      await api.logout();
    } catch {
      // ignore — session tetap dihapus di sisi frontend
    }

    const session = await getSession();
    session.destroy();

    return null;
  }, "Logout berhasil");
}
