import { api } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { formatDate, formatIDR } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function SettlementsPage() {
  await requireUser();
  const data = await api.settlements();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Riwayat Settlement</CardTitle>
        <CardDescription>Pencairan dana (T+1) kamu.</CardDescription>
      </CardHeader>
      <CardContent>
        {data.items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada settlement.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Total Transaksi</TableHead>
                <TableHead>Total Nominal</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Dicairkan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Diproses</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.total_transaction}</TableCell>
                  <TableCell>{formatIDR(s.total_amount)}</TableCell>
                  <TableCell>{formatIDR(s.total_fee)}</TableCell>
                  <TableCell className="font-medium">{formatIDR(s.net_settlement)}</TableCell>
                  <TableCell>
                    <StatusBadge status={s.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(s.processed_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
