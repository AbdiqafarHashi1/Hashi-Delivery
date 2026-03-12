import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminLinks } from "@/lib/nav";
import { formatCurrency } from "@/lib/utils";

const perItemRows = [
  { item: "Wrap", quantity: 19, sales: 8550 },
  { item: "Samosa", quantity: 24, sales: 1920 },
  { item: "Tea", quantity: 16, sales: 1920 },
  { item: "Coffee", quantity: 11, sales: 1650 }
];

const perDayRows = [
  { date: "2026-03-10", totalSales: 7240, sadioCut: 728, handover: 6512, status: "Reviewed" },
  { date: "2026-03-11", totalSales: 6810, sadioCut: 694, handover: 6116, status: "Pending" }
];

export default function AdminReportsPage() {
  return (
    <PageShell title="Reports" description="Dense operational reporting with quick filters and review state." currentPath="/admin/reports" links={adminLinks}>
      <Card>
        <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-4">
          <div><Label htmlFor="from">From</Label><Input id="from" type="date" /></div>
          <div><Label htmlFor="to">To</Label><Input id="to" type="date" /></div>
          <Button variant="outline" className="mt-6">Only mismatches</Button>
          <Button className="mt-6">Apply Filters</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Per-item Breakdown</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {perItemRows.map((row) => (
            <div key={row.item} className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 p-3">
              <p className="font-medium">{row.item}</p>
              <p className="text-muted-foreground">Qty {row.quantity}</p>
              <p className="font-semibold">{formatCurrency(row.sales)}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Per-day Breakdown</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {perDayRows.map((row) => (
            <div key={row.date} className="rounded-lg border border-border/60 bg-muted/30 p-3">
              <div className="flex items-center justify-between"><p className="font-medium">{row.date}</p><span className="rounded-full border px-2 py-0.5 text-xs">{row.status}</span></div>
              <p className="text-muted-foreground">Total {formatCurrency(row.totalSales)} · Sadio {formatCurrency(row.sadioCut)} · Handover {formatCurrency(row.handover)}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  );
}
