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
    <PageShell title="Reports" links={adminLinks}>
      <Card>
        <CardHeader>
          <CardTitle>Date Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="from">From</Label>
              <Input id="from" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Input id="to" type="date" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Per-item Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Item</th>
                  <th className="py-2">Quantity</th>
                  <th className="py-2">Sales</th>
                </tr>
              </thead>
              <tbody>
                {perItemRows.map((row) => (
                  <tr key={row.item} className="border-b last:border-b-0">
                    <td className="py-2">{row.item}</td>
                    <td>{row.quantity}</td>
                    <td>{formatCurrency(row.sales)}</td>
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
        <CardHeader>
          <CardTitle>Per-day Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Date</th>
                  <th className="py-2">Total Sales</th>
                  <th className="py-2">Sadio Cut</th>
                  <th className="py-2">Handover</th>
                </tr>
              </thead>
              <tbody>
                {perDayRows.map((row) => (
                  <tr key={row.date} className="border-b last:border-b-0">
                    <td className="py-2">{row.date}</td>
                    <td>{formatCurrency(row.totalSales)}</td>
                    <td>{formatCurrency(row.sadioCut)}</td>
                    <td>{formatCurrency(row.handover)}</td>
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
