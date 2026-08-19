"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { clientFetch } from "@/lib/client";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/types";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/payment/new", label: "Buat Pembayaran" },
  { href: "/transactions", label: "Transaksi" },
  { href: "/settlements", label: "Settlement" },
  { href: "/settings", label: "Pengaturan" },
];

export function Nav({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    try {
      await clientFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold">
            Payment Gateway
          </Link>
          <nav className="flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-accent",
                  pathname === l.href ? "bg-accent font-medium" : "text-muted-foreground",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">{user.name}</span>
          <Button variant="outline" size="sm" onClick={logout}>
            Keluar
          </Button>
        </div>
      </div>
    </header>
  );
}
