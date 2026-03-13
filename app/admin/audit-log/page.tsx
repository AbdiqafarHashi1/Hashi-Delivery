"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminLinks } from "@/lib/nav";
import { getLedgerState } from "@/lib/ledger-store";

export default function AdminAuditLogPage() {
  const [events, setEvents] = useState(getLedgerState().auditEvents);

  useEffect(() => {
    const sync = () => setEvents(getLedgerState().auditEvents);
    window.addEventListener("ledger-state-updated", sync);
    return () => window.removeEventListener("ledger-state-updated", sync);
  }, []);

  return (
    <PageShell title="Audit Log" description="Operational trace for edits, mismatches and financial actions." currentPath="/admin/audit-log" links={adminLinks}>
      <Card>
        <CardHeader><CardTitle>Recent Events</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {events.map((event) => (
            <div key={event.id} className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm">
              {event.event_at} · {event.actor} · {event.action} · {event.entity} · before: {event.before || "-"} · after: {event.after || "-"}
            </div>
          ))}
          {events.length === 0 && <p className="text-sm text-muted-foreground">No audit events yet.</p>}
        </CardContent>
      </Card>
    </PageShell>
  );
}
