import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminLinks } from "@/lib/nav";

export default function AdminAuditLogPage() {
  return (
    <PageShell title="Audit Log" links={adminLinks}>
      <Card>
        <CardHeader><CardTitle>Recent Events</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>item.create — Wrap</p>
          <p>user.role_change — Sadio data_entry</p>
          <p>daily_entry.edit — 2026-03-11</p>
        </CardContent>
      </Card>
    </PageShell>
  );
}
