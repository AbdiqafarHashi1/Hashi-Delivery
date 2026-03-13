"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { computeAccountBalances } from "@/lib/calculations";
import { getLedgerState, postManualAdjustment } from "@/lib/ledger-store";
import { formatCurrency } from "@/lib/utils";

export function AccountsClient() {
  const [state, setState] = useState(getLedgerState());
  const [account, setAccount] = useState<"cash" | "mpesa">("cash");
  const [adjustmentType, setAdjustmentType] = useState<"credit" | "debit">("credit");
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const onUpdate = () => setState(getLedgerState());
    window.addEventListener("ledger-state-updated", onUpdate);
    return () => window.removeEventListener("ledger-state-updated", onUpdate);
  }, []);

  const balances = useMemo(() => computeAccountBalances(state.accountTransactions), [state.accountTransactions]);

  const onSubmit = () => {
    setLoading(true);
    setMessage(null);
    try {
      if (amount <= 0) throw new Error("Amount must be greater than zero.");
      if (!reason.trim()) throw new Error("Reason is required.");
      postManualAdjustment({ account, adjustmentType, amount, reason: reason.trim(), actor: "Admin" });
      setMessage("Manual account adjustment posted.");
      setAmount(0);
      setReason("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not post adjustment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {[{ label: "Cash", value: balances.cash }, { label: "M-Pesa", value: balances.mpesa }, { label: "Total", value: balances.total }].map((card) => (
          <Card key={card.label}><CardHeader className="pb-1.5"><CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">{card.label} Balance</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-primary">{formatCurrency(card.value)}</p></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Manual Account Adjustment</CardTitle></CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-5">
          <Input placeholder="Account (cash/mpesa)" value={account} onChange={(event) => setAccount(event.target.value === "mpesa" ? "mpesa" : "cash")} />
          <Input placeholder="Adjustment (credit/debit)" value={adjustmentType} onChange={(event) => setAdjustmentType(event.target.value === "debit" ? "debit" : "credit")} />
          <Input type="number" min={0.01} step={0.01} placeholder="Amount" value={amount} onChange={(event) => setAmount(Number(event.target.value) || 0)} />
          <Input placeholder="Reason" value={reason} onChange={(event) => setReason(event.target.value)} />
          <Button onClick={onSubmit} disabled={loading}>{loading ? "Posting..." : "Post Adjustment"}</Button>
        </CardContent>
        {message && <CardContent className="pt-0 text-sm text-primary">{message}</CardContent>}
      </Card>

      <Card>
        <CardHeader><CardTitle>Account Transaction History</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {state.accountTransactions.map((tx) => (
            <div key={tx.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 bg-muted/30 p-3 text-sm">
              <p className="font-medium">{tx.transaction_date} · {tx.account.toUpperCase()}</p>
              <p className="text-muted-foreground">{tx.direction} {tx.adjustment_type ? `(${tx.adjustment_type})` : ""}</p>
              <p>{formatCurrency(tx.amount)}</p>
              <p className="text-muted-foreground">{tx.notes || "-"}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
