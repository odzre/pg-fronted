import Link from "next/link";
import { api } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { formatDate, formatIDR } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function TransactionsPage() {
  await requireUser();
  const data = await api.transactions();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Riwayat Transaksi</CardTitle>
        <CardDescription>Seluruh transaksi QRIS kamu.</CardDescription>
      </CardHeader>
      <CardContent>
        {data.items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada transaksi.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referensi</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((t) => (
                <TableRow key={t.reference}>
                  <TableCell>
                    <Link
                      href={`/payment/${t.reference}`}
                      className="font-mono text-xs text-primary underline-offset-4 hover:underline"
                    >
                      {t.reference}
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium">{formatIDR(t.amount)}</TableCell>
                  <TableCell>{formatIDR(t.fee)}</TableCell>
                  <TableCell>
                    <StatusBadge status={t.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(t.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
