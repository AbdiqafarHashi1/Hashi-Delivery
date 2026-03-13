"use client";

import { useMemo, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { adminLinks } from "@/lib/nav";
import { getLedgerState, getMonthlySummary } from "@/lib/ledger-store";
import { formatCurrency } from "@/lib/utils";

export default function AdminReportsPage() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const summary = getMonthlySummary(month);
  const rows = useMemo(() => getLedgerState().entries.filter((e) => e.entry_date.startsWith(month)), [month]);

  return (
    <PageShell title="Reports" description="Monthly and daily financial summaries from saved entries." currentPath="/admin/reports" links={adminLinks}>
      <Card><CardHeader><CardTitle>Month</CardTitle></CardHeader><CardContent><Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} /></CardContent></Card>
      <Card><CardHeader><CardTitle>Monthly Summary</CardTitle></CardHeader><CardContent className="space-y-1 text-sm"><p>Total Sales: {formatCurrency(summary.total_sales)}</p><p>Total COGS: {formatCurrency(summary.total_cogs)}</p><p>Total Net Profit: {formatCurrency(summary.net_profit)}</p><p>Restaurant Share: {formatCurrency(summary.restaurant_share)}</p><p>Abdiqafar Share: {formatCurrency(summary.abdiqafar_share)}</p><p>Shafie Share: {formatCurrency(summary.shafie_share)}</p></CardContent></Card>
      <Card><CardHeader><CardTitle>Daily Rows</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">{rows.map((r) => <div key={r.id} className="rounded border border-border/60 bg-muted/30 p-2">{r.entry_date} · Sales {formatCurrency(r.total_sales)} · COGS {formatCurrency(r.total_cogs)} · Net {formatCurrency(r.net_profit)}</div>)}</CardContent></Card>
    </PageShell>
  );
}
