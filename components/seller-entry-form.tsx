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

const parseNonNegativeNumber = (raw: string) => {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return parsed;
};

export function SellerEntryForm({ items }: { items: SellerVisibleItem[] }) {
  const today = new Date().toISOString().slice(0, 10);
  const [ledgerState, setLedgerState] = useState(getLedgerState());
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [mpesaReceived, setMpesaReceived] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const onUpdate = () => setLedgerState(getLedgerState());
    window.addEventListener("ledger-state-updated", onUpdate);
    return () => window.removeEventListener("ledger-state-updated", onUpdate);
  }, []);

  const todayEntry = ledgerState.entries.find((entry) => entry.entry_date === today);
  const isEditable = !todayEntry || todayEntry.entry_status === "open" || todayEntry.entry_status === "reopened";

  const rows = items.map((item) => ({
    itemId: item.id,
    itemName: item.name,
    quantity: quantities[item.id] || 0,
    sellingPrice: item.selling_price,
    commission: item.seller_commission
  }));

  const computed = useMemo(() => computeSellerEntrySummary(rows), [rows]);
  const collectionDifference = Number((cashReceived + mpesaReceived - computed.totalSales).toFixed(2));

  const setQuantity = (itemId: string, value: number) => setQuantities((prev) => ({ ...prev, [itemId]: Math.max(0, Math.floor(value)) }));

  const handleSubmit = () => {
    setError(null);
    setSuccess(null);

    if (!isEditable) {
      setError("This day is locked/submitted/reviewed. Ask admin to reopen entry.");
      return;
    }

    const hasAnyQuantity = rows.some((row) => row.quantity > 0);
    if (!hasAnyQuantity) return setError("Enter at least one item quantity greater than zero.");
    if (cashReceived < 0 || mpesaReceived < 0) return setError("Cash and M-Pesa values cannot be negative.");
    if (collectionDifference !== 0) return setError("Collection mismatch must be zero before saving.");

    setIsSaving(true);
    try {
      saveSellerEntry({ date: today, items: rows, cashReceived, mpesaReceived });
      setLedgerState(getLedgerState());
      setSuccess("Daily entry submitted successfully.");
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
          <CardDescription className="flex items-center gap-2">Compact entry rows for fast shift-end posting. {todayEntry ? <StatusBadge status={todayEntry.entry_status} /> : <StatusBadge status="open" />}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2.5">
            {items.map((item) => {
              const quantity = quantities[item.id] ?? 0;
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
                    <Input id={item.id} type="number" min={0} step={1} inputMode="numeric" disabled={!isEditable} className="h-10 text-center text-lg font-semibold" value={quantity} onChange={(event) => setQuantity(item.id, parseNonNegativeNumber(event.target.value))} />
                    <Button type="button" variant="outline" className="h-10 px-0" disabled={!isEditable} onClick={() => setQuantity(item.id, quantity + 1)}><Plus className="h-4 w-4" /></Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div className="space-y-1.5"><Label htmlFor="cash" className="text-xs uppercase tracking-wide text-muted-foreground">Cash received</Label><Input id="cash" type="number" min={0} step={0.01} disabled={!isEditable} inputMode="decimal" value={cashReceived} onChange={(event) => setCashReceived(parseNonNegativeNumber(event.target.value))} /></div>
            <div className="space-y-1.5"><Label htmlFor="mpesa" className="text-xs uppercase tracking-wide text-muted-foreground">M-Pesa received</Label><Input id="mpesa" type="number" min={0} step={0.01} disabled={!isEditable} inputMode="decimal" value={mpesaReceived} onChange={(event) => setMpesaReceived(parseNonNegativeNumber(event.target.value))} /></div>
          </div>

          <Button className="h-10 w-full text-sm font-semibold" disabled={isSaving || !isEditable} onClick={handleSubmit}>{isSaving ? "Saving..." : "Save Daily Entry"}</Button>
        </CardContent>
      </Card>

      <div className="order-1 space-y-3 xl:order-2 xl:sticky xl:top-4">
        <Card className="border-primary/35">
          <CardHeader className="pb-2"><CardTitle className="text-base">Live Summary</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Total sales</span><strong>{formatCurrency(computed.totalSales)}</strong></div>
            <div className="flex justify-between"><span>Sadio cut</span><strong>{formatCurrency(computed.sadioCut)}</strong></div>
            <div className="flex justify-between"><span>Handover amount</span><strong>{formatCurrency(computed.handoverAmount)}</strong></div>
            <div className="mt-2 rounded-lg border border-border/70 bg-muted/40 p-2"><div className="flex justify-between"><span>Cash entered</span><strong>{formatCurrency(cashReceived)}</strong></div><div className="flex justify-between"><span>M-Pesa entered</span><strong>{formatCurrency(mpesaReceived)}</strong></div></div>
            <div className="flex justify-between border-t border-border/70 pt-2 text-base"><span>Collection difference</span><strong className={collectionDifference === 0 ? "text-emerald-400" : "text-destructive"}>{formatCurrency(collectionDifference)}</strong></div>
          </CardContent>
        </Card>

        {todayEntry?.collection_difference !== 0 && !todayEntry.mismatch_resolved_at && (
          <Alert className="border-destructive/40 bg-destructive/15 text-destructive"><p className="mb-1 flex items-center gap-2 font-semibold"><AlertTriangle className="h-4 w-4" />Mismatch pending review</p><p className="text-sm">Admin review is pending for this entry.</p></Alert>
        )}
        {!isEditable && <Alert className="border-amber-500/40 bg-amber-900/30 text-amber-100">Entry is currently not editable ({todayEntry?.entry_status}).</Alert>}
        {collectionDifference !== 0 && isEditable && <Alert className="border-destructive/40 bg-destructive/15 text-destructive"><p className="mb-1 flex items-center gap-2 font-semibold"><AlertTriangle className="h-4 w-4" /> Collection mismatch</p><p className="text-sm">Cash + M-Pesa should match total sales exactly before save.</p></Alert>}
        {error && <Alert className="border-destructive/30 bg-destructive/10 text-destructive">{error}</Alert>}
        {success && <Alert className="border-emerald-500/40 bg-emerald-900/30 text-emerald-300">{success}</Alert>}
      </div>
    </div>
  );
}
