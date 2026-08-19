import Link from "next/link";
import { api } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { formatDate, formatIDR } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  await requireUser();

  const [balance, mutations] = await Promise.all([api.balance(), api.mutations()]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardDescription>Saldo tersedia</CardDescription>
          <CardTitle className="text-3xl">{formatIDR(balance.balance)}</CardTitle>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/payment/new">Buat Pembayaran</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mutasi Terakhir</CardTitle>
        </CardHeader>
        <CardContent>
          {mutations.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada mutasi.</p>
          ) : (
            <ul className="divide-y">
              {mutations.items.map((m) => (
                <li key={m.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{m.note ?? "-"}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(m.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={m.type} />
                    <p className="mt-1 text-sm font-semibold">{formatIDR(m.amount)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
