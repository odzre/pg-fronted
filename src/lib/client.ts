interface Envelope<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

/**
 * Client-side fetch helper that hits our own Next.js route handlers
 * (which proxy to the Laravel backend with the server-side session token).
 */
export async function clientFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  const json = (await res.json().catch(() => null)) as Envelope<T> | null;

  if (!res.ok || !json?.success) {
    throw new Error(json?.message ?? "Terjadi kesalahan");
  }

  return json.data as T;
}
