import { PageShell } from "@/components/page-shell";
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
  { date: "2026-03-10", totalSales: 7240, sadioCut: 728, handover: 6512 },
  { date: "2026-03-11", totalSales: 6810, sadioCut: 694, handover: 6116 }
];

export default function AdminReportsPage() {
  return (
    <PageShell title="Reports" description="Compact sales breakdowns by item and by day." currentPath="/admin/reports" links={adminLinks}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Date Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="from">From</Label>
              <Input id="from" type="date" className="h-10" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="to">To</Label>
              <Input id="to" type="date" className="h-10" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Per-item Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="hidden overflow-x-auto rounded-lg border sm:block">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-left">
                  <th className="px-3 py-2">Item</th>
                  <th className="px-3 py-2">Quantity</th>
                  <th className="px-3 py-2">Sales</th>
                </tr>
              </thead>
              <tbody>
                {perItemRows.map((row) => (
                  <tr key={row.item} className="border-t last:border-b-0">
                    <td className="px-3 py-2.5 font-medium">{row.item}</td>
                    <td className="px-3 py-2.5">{row.quantity}</td>
                    <td className="px-3 py-2.5">{formatCurrency(row.sales)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-2 sm:hidden">
            {perItemRows.map((row) => (
              <div key={row.item} className="rounded-lg border p-3 text-sm">
                <p className="font-medium">{row.item}</p>
                <p className="text-muted-foreground">Quantity: {row.quantity}</p>
                <p className="text-muted-foreground">Sales: {formatCurrency(row.sales)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Per-day Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="hidden overflow-x-auto rounded-lg border sm:block">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-left">
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Total Sales</th>
                  <th className="px-3 py-2">Sadio Cut</th>
                  <th className="px-3 py-2">Handover</th>
                </tr>
              </thead>
              <tbody>
                {perDayRows.map((row) => (
                  <tr key={row.date} className="border-t last:border-b-0">
                    <td className="px-3 py-2.5 font-medium">{row.date}</td>
                    <td className="px-3 py-2.5">{formatCurrency(row.totalSales)}</td>
                    <td className="px-3 py-2.5">{formatCurrency(row.sadioCut)}</td>
                    <td className="px-3 py-2.5">{formatCurrency(row.handover)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-2 sm:hidden">
            {perDayRows.map((row) => (
              <div key={row.date} className="rounded-lg border p-3 text-sm">
                <p className="font-medium">{row.date}</p>
                <p className="text-muted-foreground">Total Sales: {formatCurrency(row.totalSales)}</p>
                <p className="text-muted-foreground">Sadio Cut: {formatCurrency(row.sadioCut)}</p>
                <p className="text-muted-foreground">Handover: {formatCurrency(row.handover)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
