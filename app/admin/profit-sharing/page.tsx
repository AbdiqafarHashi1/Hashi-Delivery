"use client";

import { useMemo, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { adminLinks } from "@/lib/nav";
import { getLedgerState } from "@/lib/ledger-store";
import { formatCurrency } from "@/lib/utils";

export default function AdminProfitSharingPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const entries = getLedgerState().entries;
  const filtered = useMemo(() => entries.filter((e) => (!from || e.entry_date >= from) && (!to || e.entry_date <= to)), [entries, from, to]);

  return (
    <PageShell title="Profit Sharing" description="Calculated daily profit distribution with date filters." currentPath="/admin/profit-sharing" links={adminLinks}>
      <Card><CardHeader><CardTitle>Date Range</CardTitle></CardHeader><CardContent className="grid gap-2 sm:grid-cols-2"><Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /><Input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></CardContent></Card>
      <Card>
        <CardHeader><CardTitle>Daily Profit Split</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {filtered.map((row) => (
            <div key={row.id} className="rounded-lg border border-border/60 bg-muted/30 p-3">
              <p className="font-medium">{row.entry_date}</p>
              <p>Sales {formatCurrency(row.total_sales)} · COGS {formatCurrency(row.total_cogs)} · Net {formatCurrency(row.net_profit)}</p>
              <p className="text-muted-foreground">Restaurant 50%: {formatCurrency(row.restaurant_share)} · Abdiqafar 25%: {formatCurrency(row.abdiqafar_share)} · Shafie 25%: {formatCurrency(row.shafie_share)}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  );
}
