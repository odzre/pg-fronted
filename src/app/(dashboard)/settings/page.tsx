"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { clientFetch } from "@/lib/client";
import { formatDate } from "@/lib/format";
import type { ApiKeyInfo, GeneratedKey } from "@/lib/types";

export default function SettingsPage() {
  const qc = useQueryClient();
  const [generated, setGenerated] = useState<GeneratedKey | null>(null);

  const { data: keys, isLoading } = useQuery({
    queryKey: ["api-keys"],
    queryFn: () => clientFetch<ApiKeyInfo[]>("/api/api-keys"),
  });

  const createMutation = useMutation({
    mutationFn: () => clientFetch<GeneratedKey>("/api/api-keys", { method: "POST" }),
    onSuccess: (data) => {
      setGenerated(data);
      qc.invalidateQueries({ queryKey: ["api-keys"] });
      toast.success("API key dibuat");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Gagal"),
  });

  const revokeMutation = useMutation({
    mutationFn: (id: number) => clientFetch(`/api/api-keys/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["api-keys"] });
      toast.success("API key dinonaktifkan");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Gagal"),
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            API key untuk integrasi server-to-server (X-API-KEY). Plain key hanya tampil sekali saat dibuat.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
            Generate API Key
          </Button>

          {generated && (
            <div className="rounded-md border border-green-200 bg-green-50 p-4">
              <p className="text-sm font-medium">Simpan kredensial ini — hanya tampil sekali:</p>
              <p className="mt-2 break-all font-mono text-sm">Key: {generated.key}</p>
              <p className="break-all font-mono text-sm">Secret: {generated.secret}</p>
            </div>
          )}

          {isLoading && <p className="text-sm text-muted-foreground">Memuat...</p>}

          {keys && keys.length === 0 && <p className="text-sm text-muted-foreground">Belum ada API key.</p>}

          {keys && keys.length > 0 && (
            <ul className="divide-y">
              {keys.map((k) => (
                <li key={k.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-mono text-sm">{k.preview}</p>
                    <p className="text-xs text-muted-foreground">Dibuat {formatDate(k.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={k.is_active ? "success" : "outline"}>
                      {k.is_active ? "Aktif" : "Nonaktif"}
                    </Badge>
                    {k.is_active && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => revokeMutation.mutate(k.id)}
                        disabled={revokeMutation.isPending}
                      >
                        Revoke
                      </Button>
                    )}
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
