import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminLinks } from "@/lib/nav";

export default function AdminUsersPage() {
  return (
    <PageShell title="Users & Roles" links={adminLinks}>
      <Card>
        <CardHeader><CardTitle>Role Management</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>Hashi — admin</p>
          <p>Sadio — data_entry</p>
        </CardContent>
      </Card>
    </PageShell>
  );
}
