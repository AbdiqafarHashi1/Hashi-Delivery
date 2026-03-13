"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminDashboardClient } from "@/components/admin-dashboard-client";
import { PageShell } from "@/components/page-shell";
import { RecentActivityCard } from "@/components/recent-activity-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLedgerState } from "@/lib/ledger-store";
import { adminLinks } from "@/lib/nav";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [state, setState] = useState(getLedgerState());

  useEffect(() => {
    const sync = () => setState(getLedgerState());
    window.addEventListener("ledger-state-updated", sync);
    return () => window.removeEventListener("ledger-state-updated", sync);
  }, []);

  const totals = useMemo(() => state.entries.reduce((acc, row) => {
    acc.sales += row.total_sales; acc.cogs += row.total_cogs; acc.net += row.net_profit; return acc;
  }, { sales: 0, cogs: 0, net: 0 }), [state.entries]);

  const topStats = [
    { label: "Total Sales", value: totals.sales },
    { label: "Total COGS", value: totals.cogs },
    { label: "Net Profit", value: totals.net },
    { label: "Restaurant Share", value: totals.net * 0.5 }
  ];

  return (
    <PageShell title="Admin Dashboard" description="Back-office control center for daily side-sales operations." currentPath="/admin/dashboard" links={adminLinks}>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {topStats.map((stat) => (
          <Card key={stat.label}><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-primary">{formatCurrency(stat.value)}</p></CardContent></Card>
        ))}
      </section>
      <AdminDashboardClient />
      <RecentActivityCard />
    </PageShell>
  );
}
