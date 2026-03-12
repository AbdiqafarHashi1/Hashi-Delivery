import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminLinks } from "@/lib/nav";

export default function RestaurantShareExpensesPage() {
  return (
    <PageShell title="Restaurant Share Expenses" links={adminLinks}>
      <Card>
        <CardHeader><CardTitle>Expense Ledger</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>Marketing — 800.00</p>
          <p>Restaurant miscellaneous — 400.00</p>
          <p>Chef salary contribution — 1200.00</p>
        </CardContent>
      </Card>
    </PageShell>
  );
}
