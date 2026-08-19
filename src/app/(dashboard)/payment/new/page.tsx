"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clientFetch } from "@/lib/client";
import type { Transaction } from "@/lib/types";

export default function NewPaymentPage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const txn = await clientFetch<Transaction>("/api/transactions", {
        method: "POST",
        body: JSON.stringify({ amount: Number(amount), payment_method: "qris" }),
      });
      router.push(`/payment/${txn.reference}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal membuat transaksi");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Buat Pembayaran QRIS</CardTitle>
          <CardDescription>Masukkan nominal yang akan ditagihkan ke pelanggan.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Nominal (Rp)</Label>
              <Input
                id="amount"
                type="number"
                min={1}
                step="any"
                placeholder="10000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Membuat..." : "Buat QRIS"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
