import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import type {
  ApiKeyInfo,
  AuthResponse,
  Balance,
  GeneratedKey,
  Mutation,
  Paginated,
  Settlement,
  Transaction,
  User,
} from "@/lib/types";

const BASE_URL = process.env.PAYMENT_API_BASE_URL ?? "http://localhost:8000/api/v1";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface Envelope<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: unknown;
}

async function request<T>(path: string, options: RequestInit = {}, withAuth = true): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...((options.headers as Record<string, string>) ?? {}),
  };

  if (withAuth) {
    const session = await getSession();
    if (session.token) headers.Authorization = `Bearer ${session.token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers, cache: "no-store" });

  // Token invalid/expired → bersihkan session, arahkan ke halaman login.
  // (Hanya untuk request ter-autentikasi; 401 saat login = kredensial salah.)
  if (res.status === 401 && withAuth) {
    const session = await getSession();
    await session.destroy();
    redirect("/login");
  }

  const json = (await res.json().catch(() => null)) as Envelope<T> | null;

  if (!res.ok || !json?.success) {
    throw new ApiError(res.status, json?.message ?? "Terjadi kesalahan pada server.", json?.errors);
  }

  return json.data;
}

export const api = {
  login: (body: { email: string; password: string }) =>
    request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(body) }, false),

  register: (body: { name: string; email: string; password: string; password_confirmation: string }) =>
    request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(body) }, false),

  me: () => request<User>("/auth/me"),
  logout: () => request<null>("/auth/logout", { method: "POST" }),

  balance: () => request<Balance>("/balance"),
  mutations: () => request<Paginated<Mutation>>("/balance/mutations"),
  transactions: () => request<Paginated<Transaction>>("/transactions"),
  createTransaction: (body: { amount: number; payment_method?: string }) =>
    request<Transaction>("/transaction/create", { method: "POST", body: JSON.stringify(body) }),
  transaction: (reference: string) => request<Transaction>(`/transaction/${encodeURIComponent(reference)}`),
  settlements: () => request<Paginated<Settlement>>("/settlement/history"),

  apiKeys: () => request<ApiKeyInfo[]>("/api-keys"),
  createApiKey: () => request<GeneratedKey>("/api-keys", { method: "POST" }),
  revokeApiKey: (id: number) => request<null>(`/api-keys/${id}`, { method: "DELETE" }),
};
