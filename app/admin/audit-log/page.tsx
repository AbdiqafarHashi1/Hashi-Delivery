import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminLinks } from "@/lib/nav";

const auditEvents = ["item.create — Wrap", "user.role_change — Sadio data_entry", "daily_entry.edit — 2026-03-11"];

export default function AdminAuditLogPage() {
  return (
    <PageShell
      title="Audit Log"
      description="Most recent operational and configuration actions."
      currentPath="/admin/audit-log"
      links={adminLinks}
    >
      <Card>
        <CardHeader className="pb-2"><CardTitle>Recent Events</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {auditEvents.map((event) => (
            <div key={event} className="rounded-md border px-3 py-2 text-sm">
              {event}
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  );
}
