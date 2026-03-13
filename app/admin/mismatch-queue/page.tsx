"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { adminLinks } from "@/lib/nav";
import { getLedgerState, reopenDay, reopenMismatch, resolveMismatch, reviewDay } from "@/lib/ledger-store";
import { formatCurrency } from "@/lib/utils";

export default function MismatchQueuePage() {
  const [state, setState] = useState(getLedgerState());
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const onUpdate = () => setState(getLedgerState());
    window.addEventListener("ledger-state-updated", onUpdate);
    return () => window.removeEventListener("ledger-state-updated", onUpdate);
  }, []);

  const unresolved = state.entries.filter((entry) => entry.collection_difference !== 0 && !entry.mismatch_resolved_at);

  const handle = (fn: () => void) => {
    setMessage(null);
    try {
      fn();
      setState(getLedgerState());
      setMessage("Action completed.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Action failed");
    }
  };

  return (
    <PageShell title="Mismatch Queue" description="Review and resolve collection differences." currentPath="/admin/mismatch-queue" links={adminLinks}>
      <Card>
        <CardHeader><CardTitle>Unresolved Entries</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Review note" value={note} onChange={(event) => setNote(event.target.value)} />
          {unresolved.map((entry) => (
            <div key={entry.id} className="space-y-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm">
              <div className="flex items-center justify-between"><p className="font-semibold">{entry.entry_date}</p><StatusBadge status={entry.entry_status} /></div>
              <p>Difference: <strong>{formatCurrency(entry.collection_difference)}</strong></p>
              <p className="text-muted-foreground">Note: {entry.mismatch_review_note || "-"}</p>
              <div className="grid gap-2 sm:grid-cols-4">
                <Button variant="outline" onClick={() => handle(() => resolveMismatch({ date: entry.entry_date, actor: "Admin", note: note || "Resolved" }))}>Mark resolved</Button>
                <Button variant="outline" onClick={() => handle(() => reopenMismatch({ date: entry.entry_date, actor: "Admin", note: note || "Reopened" }))}>Reopen mismatch</Button>
                <Button variant="outline" onClick={() => handle(() => reopenDay(entry.entry_date, "Admin", note || "Needs correction"))}>Reopen entry</Button>
                <Button variant="outline" onClick={() => handle(() => reviewDay(entry.entry_date, "Admin"))}>Mark reviewed</Button>
              </div>
            </div>
          ))}
          {unresolved.length === 0 && <p className="text-muted-foreground">No unresolved mismatches.</p>}
          {message && <p className="text-primary">{message}</p>}
        </CardContent>
      </Card>
    </PageShell>
  );
}
