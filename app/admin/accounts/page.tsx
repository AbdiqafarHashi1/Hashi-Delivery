import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { computeAccountBalances } from "@/lib/calculations";
import { demoAccountTransactions } from "@/lib/demo-data";
import { adminLinks } from "@/lib/nav";
import { formatCurrency } from "@/lib/utils";

export default function AdminAccountsPage() {
  const balances = computeAccountBalances(demoAccountTransactions);

  return (
    <PageShell title="Accounts" description="Current balances and account movement history." currentPath="/admin/accounts" links={adminLinks}>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-1.5"><CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">Cash Balance</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold tracking-tight">{formatCurrency(balances.cash)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1.5"><CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">M-Pesa Balance</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold tracking-tight">{formatCurrency(balances.mpesa)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1.5"><CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">Total Balance</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold tracking-tight">{formatCurrency(balances.total)}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle>Account Transaction History</CardTitle></CardHeader>
        <CardContent>
          <div className="hidden overflow-x-auto rounded-lg border sm:block">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-left">
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Account</th>
                  <th className="px-3 py-2">Direction</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {demoAccountTransactions.map((tx) => (
                  <tr key={tx.id} className="border-t last:border-b-0">
                    <td className="px-3 py-2.5 font-medium">{tx.transaction_date}</td>
                    <td className="px-3 py-2.5 uppercase">{tx.account}</td>
                    <td className="px-3 py-2.5">{tx.direction}</td>
                    <td className="px-3 py-2.5">{formatCurrency(tx.amount)}</td>
                    <td className="px-3 py-2.5">{tx.notes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-2 sm:hidden">
            {demoAccountTransactions.map((tx) => (
              <div key={tx.id} className="rounded-lg border p-3 text-sm">
                <p className="font-medium">{tx.transaction_date} · {tx.account.toUpperCase()}</p>
                <p className="text-muted-foreground">{tx.direction} · {formatCurrency(tx.amount)}</p>
                <p className="text-muted-foreground">{tx.notes || "-"}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
