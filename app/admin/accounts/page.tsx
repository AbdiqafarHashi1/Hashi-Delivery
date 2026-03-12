import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { computeAccountBalances } from "@/lib/calculations";
import { demoAccountTransactions } from "@/lib/demo-data";
import { adminLinks } from "@/lib/nav";
import { formatCurrency } from "@/lib/utils";

export default function AdminAccountsPage() {
  const balances = computeAccountBalances(demoAccountTransactions);

  return (
    <PageShell title="Accounts" links={adminLinks}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Cash Balance</CardTitle></CardHeader>
          <CardContent><p className="text-xl font-semibold">{formatCurrency(balances.cash)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">M-Pesa Balance</CardTitle></CardHeader>
          <CardContent><p className="text-xl font-semibold">{formatCurrency(balances.mpesa)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Balance</CardTitle></CardHeader>
          <CardContent><p className="text-xl font-semibold">{formatCurrency(balances.total)}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Account Transaction History</CardTitle></CardHeader>
        <CardContent>
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Date</th>
                  <th className="py-2">Account</th>
                  <th className="py-2">Direction</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {demoAccountTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b last:border-b-0">
                    <td className="py-2">{tx.transaction_date}</td>
                    <td className="uppercase">{tx.account}</td>
                    <td>{tx.direction}</td>
                    <td>{formatCurrency(tx.amount)}</td>
                    <td>{tx.notes || "-"}</td>
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
