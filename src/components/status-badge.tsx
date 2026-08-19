import { Badge } from "@/components/ui/badge";

type Variant = "success" | "warning" | "destructive" | "outline" | "secondary";

const map: Record<string, { label: string; variant: Variant }> = {
  pending: { label: "Pending", variant: "warning" },
  success: { label: "Sukses", variant: "success" },
  failed: { label: "Gagal", variant: "destructive" },
  expired: { label: "Kedaluwarsa", variant: "outline" },
  processing: { label: "Diproses", variant: "warning" },
  credit: { label: "Kredit", variant: "success" },
  debit: { label: "Debit", variant: "destructive" },
};

export function StatusBadge({ status }: { status: string }) {
  const m = map[status] ?? { label: status, variant: "secondary" as Variant };
  return <Badge variant={m.variant}>{m.label}</Badge>;
}
