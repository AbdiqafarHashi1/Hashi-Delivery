import { CheckCircle2 } from "lucide-react";
import { AdminDashboardClient } from "@/components/admin-dashboard-client";
import { PageShell } from "@/components/page-shell";
import { RecentActivityCard } from "@/components/recent-activity-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminLinks } from "@/lib/nav";
import { formatCurrency } from "@/lib/utils";

const topStats = [
  { label: "Total Sales", value: 14050 },
  { label: "Post Commission Pool", value: 12628 },
  { label: "Restaurant Net Share", value: 3374 },
  { label: "Partner Final Share", value: 6314 }
];

export default function AdminDashboardPage() {
  return (
    <PageShell title="Admin Dashboard" description="Back-office control center for daily side-sales operations." currentPath="/admin/dashboard" links={adminLinks}>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {topStats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-semibold text-primary">{formatCurrency(stat.value)}</p></CardContent>
          </Card>
        ))}
      </section>

      <AdminDashboardClient />

      <section className="grid gap-4 lg:grid-cols-2">
        <RecentActivityCard />

        <Card>
          <CardHeader><CardTitle>Seller + Share Snapshot</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
              <p className="font-medium">Seller Performance</p>
              <p className="text-muted-foreground">Sadio: 2 days submitted, 1 pending review, avg sales {formatCurrency(7025)}.</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
              <p className="font-medium">Restaurant Share Status</p>
              <p className="text-muted-foreground">Gross {formatCurrency(6314)} · Expenses {formatCurrency(2940)} · Net {formatCurrency(3374)}.</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
              <p className="font-medium">Account Balances</p>
              <p className="text-muted-foreground">Cash {formatCurrency(8900)} · M-Pesa {formatCurrency(5150)}.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="border-amber-300/25 bg-amber-950/20">
        <CardContent className="flex items-start gap-2 pt-4 text-sm text-amber-100">
          <CheckCircle2 className="mt-0.5 h-4 w-4" />
          Partner share is derived from the post-commission pool and remains untouched by restaurant-side COGS.
        </CardContent>
      </Card>
    </PageShell>
  );
}
