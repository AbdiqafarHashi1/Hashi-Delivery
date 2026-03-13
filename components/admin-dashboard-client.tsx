"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<"lock" | "reopen" | "review" | null>(null);

  useEffect(() => {
    const onUpdate = () => setState(getLedgerState());
    window.addEventListener("ledger-state-updated", onUpdate);
    return () => window.removeEventListener("ledger-state-updated", onUpdate);
  }, []);

  const selectedEntry = useMemo(() => state.entries.find((entry) => entry.entry_date === date), [date, state.entries]);
  const unresolved = state.entries.filter((entry) => entry.collection_difference !== 0 && !entry.mismatch_resolved_at);

  const handleAction = async (type: "lock" | "reopen" | "review") => {
    setLoading(type);
    setMessage(null);
    try {
      if (type === "lock") {
        lockDay(date, "Admin");
        setMessage("Day locked successfully.");
      }
      if (type === "reopen") {
        if (!reason.trim()) throw new Error("Reason is required.");
        reopenDay(date, "Admin", reason.trim());
        setMessage("Day reopened successfully.");
      }
      if (type === "review") {
        reviewDay(date, "Admin");
        setMessage("Day marked reviewed.");
      }
      setState(getLedgerState());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Action failed.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
      <Card>
        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-[1fr_1fr]">
            <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
            <Input placeholder="Reopen reason (required for reopen)" value={reason} onChange={(event) => setReason(event.target.value)} />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Button disabled={loading !== null || selectedEntry?.entry_status === "locked"} onClick={() => handleAction("lock")}><Lock className="mr-2 h-4 w-4" /> {loading === "lock" ? "Locking..." : "Lock Today Entries"}</Button>
            <Button variant="outline" disabled={loading !== null || !selectedEntry || (selectedEntry.entry_status !== "locked" && selectedEntry.entry_status !== "submitted" && selectedEntry.entry_status !== "reviewed")} onClick={() => handleAction("reopen")}><Unlock className="mr-2 h-4 w-4" /> {loading === "reopen" ? "Reopening..." : "Reopen Entry"}</Button>
            <Button variant="outline" disabled={loading !== null || !selectedEntry} onClick={() => handleAction("review")}>{loading === "review" ? "Marking..." : "Mark Day Reviewed"}</Button>
            <Button variant="outline" asChild><Link href="/admin/accounts">Post Manual Account Adjustment</Link></Button>
          </div>

          <div className="rounded-lg border border-border/60 bg-muted/30 p-3 text-sm">
            <p className="font-semibold">Selected day status</p>
            {selectedEntry ? (
              <div className="mt-2 space-y-1">
                <StatusBadge status={selectedEntry.entry_status} />
                <p className="text-muted-foreground">Locked by: {selectedEntry.locked_by || "-"} · Reopened by: {selectedEntry.reopened_by || "-"}</p>
                <p className="text-muted-foreground">Reviewed by: {selectedEntry.reviewed_by || "-"}</p>
              </div>
            ) : <p className="text-muted-foreground">No entry yet for this date.</p>}
          </div>
          {message && <p className="text-sm text-primary">{message}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Unresolved Mismatch</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {unresolved.slice(0, 1).map((entry) => (
            <div key={entry.id} className="rounded-lg border border-destructive/40 bg-destructive/10 p-3">
              <p className="font-semibold">{entry.entry_date}</p>
              <p className="text-muted-foreground">Difference: {formatCurrency(entry.collection_difference)} · {entry.mismatch_review_note || "Waiting review note."}</p>
            </div>
          ))}
          {unresolved.length === 0 && <p className="text-muted-foreground">No unresolved mismatches.</p>}
          <Button variant="outline" className="w-full" asChild><Link href="/admin/mismatch-queue">Open Mismatch Queue</Link></Button>
        </CardContent>
      </Card>
    </section>
  );
}
