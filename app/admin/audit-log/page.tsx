import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { adminLinks } from "@/lib/nav";

const auditEvents = [
  "item.create — Wrap",
  "user.role_change — Sadio data_entry",
  "daily_entry.edit — 2026-03-11 reason: reconciliation fix",
  "entry.reopen — 2026-03-10 reason: late M-Pesa confirmation"
];

export default function AdminAuditLogPage() {
  return (
    <PageShell title="Audit Log" description="Operational trace for reviews, reopens and configuration changes." currentPath="/admin/audit-log" links={adminLinks}>
      <Card>
        <CardHeader><CardTitle>Audit Filters</CardTitle></CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-5">
          <Input placeholder="Actor" />
          <Input placeholder="Action" />
          <Input type="date" />
          <Button variant="outline">Only financial events</Button>
          <Button>Apply Filters</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recent Events</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {auditEvents.map((event) => (
            <div key={event} className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm">{event}</div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  );
}
