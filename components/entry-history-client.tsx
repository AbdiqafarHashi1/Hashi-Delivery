"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLedgerState } from "@/lib/ledger-store";
import { formatCurrency } from "@/lib/utils";

export function EntryHistoryClient() {
  const [entries, setEntries] = useState(getLedgerState().entries);

  useEffect(() => {
    const onUpdate = () => setEntries(getLedgerState().entries);
    window.addEventListener("ledger-state-updated", onUpdate);
    return () => window.removeEventListener("ledger-state-updated", onUpdate);
  }, []);

  return (
    <div className="grid gap-3">
      {entries.map((row) => (
        <Card key={row.id} className="border-border/70">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-sm sm:text-base">{row.entry_date}</CardTitle>
              <div className="flex items-center gap-2"><StatusBadge status={row.entry_status} /><p className="text-xl font-semibold text-primary">{formatCurrency(row.total_sales)}</p></div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4 sm:text-sm">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-2"><p className="uppercase tracking-wide text-muted-foreground">Sadio commission</p><p className="font-semibold">{formatCurrency(row.sadio_cut)}</p></div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-2"><p className="uppercase tracking-wide text-muted-foreground">Handover</p><p className="font-semibold">{formatCurrency(row.handover_amount)}</p></div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-2"><p className="uppercase tracking-wide text-muted-foreground">Cash</p><p className="font-semibold">{formatCurrency(row.cash_received)}</p></div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-2"><p className="uppercase tracking-wide text-muted-foreground">M-Pesa</p><p className="font-semibold">{formatCurrency(row.mpesa_received)}</p></div>
          </CardContent>
          {row.collection_difference !== 0 && !row.mismatch_resolved_at && <CardContent className="pt-0 text-sm text-destructive">Mismatch pending review: {formatCurrency(row.collection_difference)}</CardContent>}
        </Card>
      ))}
    </div>
  );
}
