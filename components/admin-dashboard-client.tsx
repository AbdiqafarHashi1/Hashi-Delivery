"use client";

import { useEffect, useMemo, useState } from "react";
import { Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/status-badge";
import { getLedgerState, lockDay, reopenDay, reviewDay } from "@/lib/ledger-store";
import { formatCurrency } from "@/lib/utils";

export function AdminDashboardClient() {
  const [state, setState] = useState(getLedgerState());
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [reason, setReason] = useState("");

  useEffect(() => {
    const onUpdate = () => setState(getLedgerState());
    window.addEventListener("ledger-state-updated", onUpdate);
    return () => window.removeEventListener("ledger-state-updated", onUpdate);
  }, []);

  const selectedEntry = useMemo(() => state.entries.find((entry) => entry.entry_date === date), [date, state.entries]);
  const unresolved = state.entries.filter((entry) => entry.collection_difference !== 0 && !entry.mismatch_resolved_at);

  return (
    <section className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
      <Card>
        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-[1fr_1fr]"><Input type="date" value={date} onChange={(event) => setDate(event.target.value)} /><Input placeholder="Reopen reason" value={reason} onChange={(event) => setReason(event.target.value)} /></div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button onClick={() => lockDay(date, "Admin")}><Lock className="mr-2 h-4 w-4" />Lock day</Button>
            <Button variant="outline" onClick={() => reopenDay(date, "Admin", reason || "Needs correction")}><Unlock className="mr-2 h-4 w-4" />Reopen day</Button>
            <Button variant="outline" onClick={() => reviewDay(date, "Admin")}>Mark reviewed</Button>
            <Button variant="outline" onClick={() => window.location.href = "/admin/accounts"}>Open accounts</Button>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-3 text-sm">{selectedEntry ? <><StatusBadge status={selectedEntry.entry_status} /><p className="text-muted-foreground mt-1">Sales {formatCurrency(selectedEntry.total_sales)} · Net {formatCurrency(selectedEntry.net_profit)}</p></> : <p className="text-muted-foreground">No entry for selected date.</p>}</div>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle>Unresolved Mismatch</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">{unresolved.slice(0, 1).map((entry) => <div key={entry.id} className="rounded-lg border border-destructive/40 bg-destructive/10 p-3"><p className="font-semibold">{entry.entry_date}</p><p className="text-muted-foreground">Difference: {formatCurrency(entry.collection_difference)} · {entry.mismatch_review_note || "Waiting review note."}</p></div>)}{unresolved.length === 0 && <p className="text-muted-foreground">No unresolved mismatches.</p>}<Button variant="outline" className="w-full" onClick={() => window.location.href = "/admin/mismatch-queue"}>Open Mismatch Queue</Button></CardContent></Card>
    </section>
  );
}
