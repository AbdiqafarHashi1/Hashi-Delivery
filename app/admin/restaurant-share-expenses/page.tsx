"use client";

import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { computeAccountBalances } from "@/lib/calculations";
import { addRestaurantExpense, getLedgerState } from "@/lib/ledger-store";
import { adminLinks } from "@/lib/nav";
import { formatCurrency } from "@/lib/utils";

export default function RestaurantShareExpensesPage() {
  const [state, setState] = useState(getLedgerState());
  const [category, setCategory] = useState("marketing");
  const [amount, setAmount] = useState(0);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const sync = () => setState(getLedgerState());
    window.addEventListener("ledger-state-updated", sync);
    return () => window.removeEventListener("ledger-state-updated", sync);
  }, []);

  const restaurantShareEarned = useMemo(() => state.entries.reduce((sum, e) => sum + e.restaurant_share, 0), [state.entries]);
  const restaurantExpenses = useMemo(() => state.restaurantExpenses.reduce((sum, e) => sum + e.amount, 0), [state.restaurantExpenses]);
  const balances = computeAccountBalances(state.accountTransactions);

  return (
    <PageShell title="Restaurant Share Expenses" description="Track restaurant spend and remaining share balance." currentPath="/admin/restaurant-share-expenses" links={adminLinks}>
      <Card><CardHeader><CardTitle>Expense Controls</CardTitle></CardHeader><CardContent className="grid gap-2 sm:grid-cols-5"><Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" /><Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} placeholder="Amount" /><Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" /><Button onClick={() => addRestaurantExpense({ expense_date: new Date().toISOString().slice(0, 10), category, amount, notes, actor: "Admin" })}>Post Expense</Button></CardContent></Card>
      <Card><CardHeader><CardTitle>Balance Snapshot</CardTitle></CardHeader><CardContent className="space-y-1 text-sm"><p>Restaurant Balance: {formatCurrency(balances.restaurant)}</p><p>Restaurant Share Earned: {formatCurrency(restaurantShareEarned)}</p><p>Restaurant Expenses: {formatCurrency(restaurantExpenses)}</p><p>Remaining Balance: {formatCurrency(restaurantShareEarned - restaurantExpenses)}</p></CardContent></Card>
      <Card><CardHeader><CardTitle>Expense Ledger</CardTitle></CardHeader><CardContent className="space-y-2">{state.restaurantExpenses.map((expense) => <div key={expense.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm"><p className="font-medium">{expense.expense_date} · {expense.category}</p><p>{formatCurrency(expense.amount)}</p><span>{expense.notes || "-"}</span></div>)}</CardContent></Card>
    </PageShell>
  );
}
