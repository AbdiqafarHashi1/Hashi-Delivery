import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { computeAccountBalances } from "@/lib/calculations";
import { demoAccountTransactions } from "@/lib/demo-data";
import { adminLinks } from "@/lib/nav";
import { formatCurrency } from "@/lib/utils";

export default function AdminAccountsPage() {
  const balances = computeAccountBalances(demoAccountTransactions);

  return (
    <PageShell title="Accounts" description="Live balances, adjustments and account movement history." currentPath="/admin/accounts" links={adminLinks}>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {[{ label: "Cash", value: balances.cash }, { label: "M-Pesa", value: balances.mpesa }, { label: "Total", value: balances.total }].map((card) => (
          <Card key={card.label}><CardHeader className="pb-1.5"><CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">{card.label} Balance</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-primary">{formatCurrency(card.value)}</p></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Manual Account Adjustment</CardTitle></CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-5">
          <Input placeholder="Account (cash/mpesa)" />
          <Input placeholder="Direction" />
          <Input type="number" placeholder="Amount" />
          <Input placeholder="Reason" />
          <Button>Post Adjustment</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Account Transaction History</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {demoAccountTransactions.map((tx) => (
            <div key={tx.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 bg-muted/30 p-3 text-sm">
              <p className="font-medium">{tx.transaction_date} · {tx.account.toUpperCase()}</p>
              <p className="text-muted-foreground">{tx.direction}</p>
              <p>{formatCurrency(tx.amount)}</p>
              <p className="text-muted-foreground">{tx.notes || "-"}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  );
}
