import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demoHistory } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

export default function EntryHistoryPage() {
  return (
    <PageShell
      title="My Entry History"
      description="Operational timeline of submitted days and collection quality."
      currentPath="/entry/history"
      links={[
        { href: "/entry/today", label: "Today" },
        { href: "/entry/history", label: "History" }
      ]}
    >
      <div className="grid gap-3">
        {demoHistory.map((row) => (
          <Card key={row.id} className="border-border/70">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-sm sm:text-base">{row.entry_date}</CardTitle>
                <p className="text-xl font-semibold text-primary">{formatCurrency(row.total_sales)}</p>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4 sm:text-sm">
              <div className="rounded-lg border border-border/60 bg-muted/30 p-2">
                <p className="uppercase tracking-wide text-muted-foreground">Sadio commission</p>
                <p className="font-semibold">{formatCurrency(row.sadio_cut)}</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/30 p-2">
                <p className="uppercase tracking-wide text-muted-foreground">Handover</p>
                <p className="font-semibold">{formatCurrency(row.handover_amount)}</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/30 p-2">
                <p className="uppercase tracking-wide text-muted-foreground">Cash</p>
                <p className="font-semibold">{formatCurrency(row.cash_received)}</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/30 p-2">
                <p className="uppercase tracking-wide text-muted-foreground">M-Pesa</p>
                <p className="font-semibold">{formatCurrency(row.mpesa_received)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
