import { api } from "@/lib/api";
import { handleRoute } from "@/lib/route";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  return handleRoute(() => api.revokeApiKey(Number(params.id)), "API key dinonaktifkan");
}
