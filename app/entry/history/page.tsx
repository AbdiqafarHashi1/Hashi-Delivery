import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demoHistory } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

export default function EntryHistoryPage() {
  return (
    <PageShell
      title="My Entry History"
      links={[
        { href: "/entry/today", label: "Today" },
        { href: "/entry/history", label: "History" }
      ]}
    >
      <div className="space-y-3">
        {demoHistory.map((row) => (
          <Card key={row.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{row.entry_date}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
              <p>Total sales: {formatCurrency(row.total_sales)}</p>
              <p>Sadio commission: {formatCurrency(row.sadio_cut)}</p>
              <p>Handover amount: {formatCurrency(row.handover_amount)}</p>
              <p>
                Cash: {formatCurrency(row.cash_received)} | M-Pesa: {formatCurrency(row.mpesa_received)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
