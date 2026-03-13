"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Minus, Plus } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/status-badge";
import { computeSellerEntrySummary } from "@/lib/calculations";
import { getLedgerState, saveSellerEntry } from "@/lib/ledger-store";
import { SellerVisibleItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const parseToNumberOrZero = (raw: string) => {
  if (raw.trim() === "") return 0;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return parsed;
};

export function SellerEntryForm({ items }: { items: SellerVisibleItem[] }) {
  const today = new Date().toISOString().slice(0, 10);
  const [ledgerState, setLedgerState] = useState(getLedgerState());
  const [quantityInputs, setQuantityInputs] = useState<Record<string, string>>({});
  const [cashInput, setCashInput] = useState("0");
  const [mpesaInput, setMpesaInput] = useState("0");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const onUpdate = () => setLedgerState(getLedgerState());
    window.addEventListener("ledger-state-updated", onUpdate);
    return () => window.removeEventListener("ledger-state-updated", onUpdate);
  }, []);

  const entry = ledgerState.entries.find((row) => row.entry_date === today) ?? null;
  const isEditable = !entry || entry.entry_status === "open" || entry.entry_status === "reopened";

  const quantities = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.id] = Math.max(0, Math.floor(parseToNumberOrZero(quantityInputs[item.id] ?? "0")));
    return acc;
  }, {});

  const rows = items.map((item) => ({ itemId: item.id, itemName: item.name, quantity: quantities[item.id], sellingPrice: item.selling_price, commission: item.seller_commission }));
  const computed = useMemo(() => computeSellerEntrySummary(rows), [rows]);
  const cashReceived = parseToNumberOrZero(cashInput);
  const mpesaReceived = parseToNumberOrZero(mpesaInput);
  const collectionDifference = Number((cashReceived + mpesaReceived - computed.totalSales).toFixed(2));

  const setQuantity = (itemId: string, value: number) => setQuantityInputs((prev) => ({ ...prev, [itemId]: String(Math.max(0, Math.floor(value))) }));

  const onNumericFocus = (value: string, setter: (value: string) => void) => {
    if (value === "0") setter("");
  };
  const onNumericBlur = (value: string, setter: (value: string) => void) => {
    if (value.trim() === "") setter("0");
  };

  const handleSubmit = () => {
    setError(null);
    setSuccess(null);
    if (!isEditable) return setError("This day is locked/submitted/reviewed. Ask admin to reopen entry.");
    if (!rows.some((row) => row.quantity > 0)) return setError("Enter at least one item quantity greater than zero.");

    setIsSaving(true);
    try {
      saveSellerEntry({ date: today, items: rows, cashReceived, mpesaReceived });
      setSuccess("Daily entry submitted successfully.");
      setLedgerState(getLedgerState());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save entry.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr] xl:items-start">
      <Card className="order-2 xl:order-1">
        <CardHeader className="pb-3">
          <CardTitle>Today&apos;s Side Sales Entry</CardTitle>
          <CardDescription className="flex items-center gap-2">Compact entry rows for fast shift-end posting. {entry ? <StatusBadge status={entry.entry_status} /> : <StatusBadge status="open" />}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2.5">
            {items.map((item) => {
              const quantityValue = quantityInputs[item.id] ?? "0";
              const quantity = quantities[item.id];
              return (
                <div key={item.id} className="rounded-xl border border-border/70 bg-muted/30 p-2.5 sm:p-3">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <Label htmlFor={item.id} className="text-sm font-semibold">{item.name}</Label>
                      <p className="text-xs text-muted-foreground">{formatCurrency(item.selling_price)} sale · {formatCurrency(item.seller_commission)} commission</p>
                    </div>
                    <p className="rounded-md border border-primary/40 bg-primary/15 px-2 py-1 text-xs font-semibold text-primary">QTY {quantity}</p>
                  </div>
                  <div className="grid grid-cols-[40px_1fr_40px] items-center gap-2 sm:grid-cols-[44px_1fr_44px]">
                    <Button type="button" variant="outline" className="h-10 px-0" disabled={!isEditable} onClick={() => setQuantity(item.id, quantity - 1)}><Minus className="h-4 w-4" /></Button>
                    <Input id={item.id} type="number" min={0} step={1} inputMode="numeric" disabled={!isEditable} className="h-10 text-center text-lg font-semibold" value={quantityValue} onFocus={() => onNumericFocus(quantityValue, (v) => setQuantityInputs((p) => ({ ...p, [item.id]: v })))} onBlur={() => onNumericBlur(quantityInputs[item.id] ?? "", (v) => setQuantityInputs((p) => ({ ...p, [item.id]: v })))} onChange={(event) => setQuantityInputs((prev) => ({ ...prev, [item.id]: event.target.value }))} />
                    <Button type="button" variant="outline" className="h-10 px-0" disabled={!isEditable} onClick={() => setQuantity(item.id, quantity + 1)}><Plus className="h-4 w-4" /></Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div className="space-y-1.5"><Label htmlFor="cash" className="text-xs uppercase tracking-wide text-muted-foreground">Cash received</Label><Input id="cash" type="number" min={0} step={0.01} disabled={!isEditable} inputMode="decimal" value={cashInput} onFocus={() => onNumericFocus(cashInput, setCashInput)} onBlur={() => onNumericBlur(cashInput, setCashInput)} onChange={(event) => setCashInput(event.target.value)} /></div>
            <div className="space-y-1.5"><Label htmlFor="mpesa" className="text-xs uppercase tracking-wide text-muted-foreground">M-Pesa received</Label><Input id="mpesa" type="number" min={0} step={0.01} disabled={!isEditable} inputMode="decimal" value={mpesaInput} onFocus={() => onNumericFocus(mpesaInput, setMpesaInput)} onBlur={() => onNumericBlur(mpesaInput, setMpesaInput)} onChange={(event) => setMpesaInput(event.target.value)} /></div>
          </div>

          <Button className="h-10 w-full text-sm font-semibold" disabled={isSaving || !isEditable} onClick={handleSubmit}>{isSaving ? "Saving..." : "Save Daily Entry"}</Button>
        </CardContent>
      </Card>

      <div className="order-1 space-y-3 xl:order-2 xl:sticky xl:top-4">
        <Card className="border-primary/35"><CardHeader className="pb-2"><CardTitle className="text-base">Live Summary</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><div className="flex justify-between"><span>Total sales</span><strong>{formatCurrency(computed.totalSales)}</strong></div><div className="flex justify-between"><span>Seller commission</span><strong>{formatCurrency(computed.sellerCommission)}</strong></div><div className="flex justify-between"><span>Handover amount</span><strong>{formatCurrency(computed.handoverAmount)}</strong></div><div className="mt-2 rounded-lg border border-border/70 bg-muted/40 p-2"><div className="flex justify-between"><span>Cash entered</span><strong>{formatCurrency(cashReceived)}</strong></div><div className="flex justify-between"><span>M-Pesa entered</span><strong>{formatCurrency(mpesaReceived)}</strong></div></div><div className="flex justify-between border-t border-border/70 pt-2 text-base"><span>Collection difference</span><strong className={collectionDifference === 0 ? "text-emerald-400" : "text-destructive"}>{formatCurrency(collectionDifference)}</strong></div></CardContent></Card>
        {collectionDifference !== 0 && <Alert className="border-destructive/40 bg-destructive/15 text-destructive"><p className="mb-1 flex items-center gap-2 font-semibold"><AlertTriangle className="h-4 w-4" /> Collection mismatch</p><p className="text-sm">Saved entries with mismatches appear in admin mismatch queue.</p></Alert>}
        {error && <Alert className="border-destructive/30 bg-destructive/10 text-destructive">{error}</Alert>}
        {success && <Alert className="border-emerald-500/40 bg-emerald-900/30 text-emerald-300">{success}</Alert>}
      </div>
    </div>
  );
}
