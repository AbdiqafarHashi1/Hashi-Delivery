import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminLinks } from "@/lib/nav";

const expenseRows = [
  { name: "Marketing", amount: "800.00" },
  { name: "Restaurant miscellaneous", amount: "400.00" },
  { name: "Chef salary contribution", amount: "1200.00" }
];

export default function RestaurantShareExpensesPage() {
  return (
    <PageShell
      title="Restaurant Share Expenses"
      description="Tracked costs deducted only from restaurant-side allocations."
      currentPath="/admin/restaurant-share-expenses"
      links={adminLinks}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Expense Ledger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {expenseRows.map((expense) => (
            <div key={expense.name} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
              <p className="font-medium">{expense.name}</p>
              <p className="font-semibold">{expense.amount}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  );
}
