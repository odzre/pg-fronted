import { NextResponse } from "next/server";

/**
 * Wrapper for API route handlers that forward to the Laravel backend.
 * Normalizes the response envelope and error status.
 */
export async function handleRoute(fn: () => Promise<unknown>, okMessage = "OK") {
  try {
    const data = await fn();
    return NextResponse.json({ success: true, message: okMessage, data });
  } catch (e) {
    const err = e as { status?: number; message?: string; errors?: unknown };
    const status = typeof err.status === "number" && err.status >= 400 ? err.status : 500;
    return NextResponse.json(
      { success: false, message: err.message ?? "Terjadi kesalahan pada server.", errors: err.errors ?? null },
      { status },
    );
  }
}
