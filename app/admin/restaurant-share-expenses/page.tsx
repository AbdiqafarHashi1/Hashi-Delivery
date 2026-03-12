import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { adminLinks } from "@/lib/nav";

const expenseRows = [
  { name: "Marketing", amount: "800.00", status: "approved" },
  { name: "Restaurant miscellaneous", amount: "400.00", status: "pending" },
  { name: "Chef salary contribution", amount: "1200.00", status: "approved" }
];

export default function RestaurantShareExpensesPage() {
  return (
    <PageShell title="Restaurant Share Expenses" description="Expense control for restaurant-side deductions only." currentPath="/admin/restaurant-share-expenses" links={adminLinks}>
      <Card>
        <CardHeader><CardTitle>Expense Controls</CardTitle></CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-5">
          <Input placeholder="Category" />
          <Input type="number" placeholder="Amount" />
          <Input placeholder="Reason" />
          <Button variant="outline">Save Draft</Button>
          <Button>Post Expense</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Expense Ledger</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {expenseRows.map((expense) => (
            <div key={expense.name} className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm">
              <p className="font-medium">{expense.name}</p>
              <p className="text-muted-foreground">{expense.amount}</p>
              <span className="rounded-full border px-2 py-0.5 text-xs">{expense.status}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  );
}
