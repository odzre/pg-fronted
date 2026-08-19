import { api } from "@/lib/api";
import { handleRoute } from "@/lib/route";

export async function POST() {
  return handleRoute(() => api.createApiKey(), "API key dibuat");
}
