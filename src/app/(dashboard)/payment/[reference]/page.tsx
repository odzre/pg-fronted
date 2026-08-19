"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { QrCode } from "@/components/qr-code";
import { StatusBadge } from "@/components/status-badge";
import { clientFetch } from "@/lib/client";
import { formatIDR } from "@/lib/format";
import type { Transaction } from "@/lib/types";

export default function PaymentStatusPage({ params }: { params: { reference: string } }) {
  const { data, isLoading } = useQuery({
    queryKey: ["transaction", params.reference],
    queryFn: () => clientFetch<Transaction>(`/api/transactions/${params.reference}`),
    refetchInterval: (query) => (query.state.data?.status === "pending" ? 3000 : false),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-md space-y-3">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!data) return null;

  const txn = data as Transaction;

  return (
    <div className="mx-auto max-w-md space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pembayaran</CardTitle>
            <StatusBadge status={txn.status} />
          </div>
          <CardDescription className="break-all">{txn.reference}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Nominal</p>
            <p className="text-2xl font-bold">{formatIDR(txn.amount)}</p>
          </div>

          {txn.status === "pending" && !txn.qr_content && (
            <p className="text-center text-sm text-muted-foreground">
              Menyiapkan kode QR...
            </p>
          )}

          {txn.qr_content && (txn.status === "pending" || txn.status === "success") && (
            <div className="flex flex-col items-center gap-2">
              <QrCode value={txn.qr_content} />
              <p className="text-center text-sm text-muted-foreground">
                {txn.status === "pending"
                  ? "Scan kode QR untuk membayar."
                  : "Pembayaran telah diterima."}
              </p>
            </div>
          )}

          {txn.status === "success" && (
            <Button asChild className="w-full">
              <Link href="/">Kembali ke Dashboard</Link>
            </Button>
          )}

          {(txn.status === "failed" || txn.status === "expired") && (
            <div className="text-center">
              <p className="text-sm text-destructive">Transaksi {txn.status === "failed" ? "gagal" : "kedaluwarsa"}.</p>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link href="/payment/new">Buat Transaksi Baru</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
