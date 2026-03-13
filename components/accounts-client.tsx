"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { computeAccountBalances } from "@/lib/calculations";
import { getLedgerState, postAccountTransaction } from "@/lib/ledger-store";
import { formatCurrency } from "@/lib/utils";

export function AccountsClient() {
  const [state, setState] = useState(getLedgerState());
  const [account, setAccount] = useState<"restaurant" | "abdiqafar" | "shafie">("restaurant");
  const [direction, setDirection] = useState<"outflow" | "adjustment">("outflow");
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState("");

  useEffect(() => {
    const onUpdate = () => setState(getLedgerState());
    window.addEventListener("ledger-state-updated", onUpdate);
    return () => window.removeEventListener("ledger-state-updated", onUpdate);
  }, []);

  const balances = useMemo(() => computeAccountBalances(state.accountTransactions), [state.accountTransactions]);

  return (
    <>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {[{ label: "Restaurant", value: balances.restaurant }, { label: "Abdiqafar", value: balances.abdiqafar }, { label: "Shafie", value: balances.shafie }].map((card) => (
          <Card key={card.label}><CardHeader className="pb-1.5"><CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">{card.label} Account</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-primary">{formatCurrency(card.value)}</p></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Account Outflow / Adjustment</CardTitle></CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-5">
          <Input value={account} onChange={(event) => setAccount((event.target.value as typeof account) || "restaurant")} placeholder="restaurant" />
          <Input value={direction} onChange={(event) => setDirection(event.target.value === "adjustment" ? "adjustment" : "outflow")} placeholder="outflow" />
          <Input type="number" min={0.01} step={0.01} value={amount} onChange={(event) => setAmount(Number(event.target.value) || 0)} placeholder="Amount" />
          <Input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Reason" />
          <Button onClick={() => postAccountTransaction({ account_owner: account, direction, amount, notes: reason, actor: "Admin" })}>Post</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {state.accountTransactions.map((tx) => (
            <div key={tx.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 bg-muted/30 p-3 text-sm">
              <p className="font-medium">{tx.transaction_date} · {tx.account_owner.toUpperCase()}</p>
              <p className="text-muted-foreground">{tx.direction}</p>
              <p>{formatCurrency(tx.amount)}</p>
              <p className="text-muted-foreground">{tx.notes || "-"}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
