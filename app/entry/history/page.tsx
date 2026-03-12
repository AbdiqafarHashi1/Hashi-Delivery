import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demoHistory } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

export default function EntryHistoryPage() {
  return (
    <PageShell
      title="My Entry History"
      description="Review previous submissions with totals and collection channels."
      currentPath="/entry/history"
      links={[
        { href: "/entry/today", label: "Today" },
        { href: "/entry/history", label: "History" }
      ]}
    >
      <div className="grid gap-2.5">
        {demoHistory.map((row) => (
          <Card key={row.id} className="border-muted/70">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-sm sm:text-base">{row.entry_date}</CardTitle>
                <p className="text-lg font-semibold">{formatCurrency(row.total_sales)}</p>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-4 sm:text-sm">
              <div>
                <p className="uppercase tracking-wide">Sadio commission</p>
                <p className="font-medium text-foreground">{formatCurrency(row.sadio_cut)}</p>
              </div>
              <div>
                <p className="uppercase tracking-wide">Handover</p>
                <p className="font-medium text-foreground">{formatCurrency(row.handover_amount)}</p>
              </div>
              <div>
                <p className="uppercase tracking-wide">Cash</p>
                <p className="font-medium text-foreground">{formatCurrency(row.cash_received)}</p>
              </div>
              <div>
                <p className="uppercase tracking-wide">M-Pesa</p>
                <p className="font-medium text-foreground">{formatCurrency(row.mpesa_received)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
