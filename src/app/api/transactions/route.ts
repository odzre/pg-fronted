import { api } from "@/lib/api";
import { handleRoute } from "@/lib/route";

export async function POST(req: Request) {
  const body = (await req.json()) as { amount: number; payment_method?: string };

  return handleRoute(() => api.createTransaction(body), "Transaksi dibuat");
}
