import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { adminLinks } from "@/lib/nav";

const users = [
  { name: "Hashi", role: "admin", status: "active" },
  { name: "Sadio", role: "data_entry", status: "active" },
  { name: "Fatima", role: "viewer", status: "inactive" }
];

export default function AdminUsersPage() {
  return (
    <PageShell title="Users & Roles" description="Access control, account status and permission audits." currentPath="/admin/users" links={adminLinks}>
      <Card>
        <CardHeader><CardTitle>User Controls</CardTitle></CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-4">
          <Input placeholder="Search user" />
          <Button variant="outline">Filter Active</Button>
          <Button variant="outline">Filter Role</Button>
          <Button>Invite User</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Role Management</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {users.map((user) => (
            <div key={user.name} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/70 bg-muted/30 p-3">
              <p className="font-medium">{user.name} <span className="ml-2 text-xs uppercase text-muted-foreground">{user.role}</span></p>
              <div className="flex gap-2">
                <span className="rounded-full border px-2 py-1 text-xs">{user.status}</span>
                <Button variant="outline" size="sm">Toggle Active</Button>
                <Button variant="outline" size="sm">Change Role</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  );
}
