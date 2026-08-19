import { api } from "@/lib/api";
import { handleRoute } from "@/lib/route";

export async function GET(_req: Request, { params }: { params: { reference: string } }) {
  return handleRoute(() => api.transaction(params.reference));
}
