"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLedgerState } from "@/lib/ledger-store";

export function RecentActivityCard() {
  const [events, setEvents] = useState(getLedgerState().auditEvents);

  useEffect(() => {
    const onUpdate = () => setEvents(getLedgerState().auditEvents);
    window.addEventListener("ledger-state-updated", onUpdate);
    return () => window.removeEventListener("ledger-state-updated", onUpdate);
  }, []);

  return (
    <Card>
      <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        {events.slice(0, 4).map((event) => (
          <div key={event.id} className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2">{event.action} · {event.notes}</div>
        ))}
        {events.length === 0 && <p className="text-muted-foreground">No activity yet.</p>}
      </CardContent>
    </Card>
  );
}
