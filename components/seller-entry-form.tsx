"use client";

import { useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { computeSellerEntrySummary } from "@/lib/calculations";
import { SellerVisibleItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const parseNonNegativeNumber = (raw: string) => {
  const parsed = Number(raw);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return parsed;
};

export function SellerEntryForm({ items }: { items: SellerVisibleItem[] }) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [mpesaReceived, setMpesaReceived] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const rows = items.map((item) => ({
    itemId: item.id,
    itemName: item.name,
    quantity: quantities[item.id] || 0,
    sellingPrice: item.selling_price,
    commission: item.seller_commission
  }));

  const computed = useMemo(() => computeSellerEntrySummary(rows), [rows]);
  const collectionDifference = Number((cashReceived + mpesaReceived - computed.totalSales).toFixed(2));

  const setQuantity = (itemId: string, value: number) => {
    setQuantities((prev) => ({ ...prev, [itemId]: Math.max(0, Math.floor(value)) }));
  };

  const handleSubmit = () => {
    setError(null);
    setSuccess(null);

    const hasAnyQuantity = rows.some((row) => row.quantity > 0);
    if (!hasAnyQuantity) {
      setError("Enter at least one item quantity greater than zero.");
      return;
    }

    if (cashReceived < 0 || mpesaReceived < 0) {
      setError("Cash and M-Pesa values cannot be negative.");
      return;
    }

    if (collectionDifference !== 0) {
      setError("Collection mismatch must be zero before saving.");
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const duplicateKey = `daily-entry:${today}`;

    if (window.localStorage.getItem(duplicateKey)) {
      setError("Today’s entry already exists. Duplicate daily submission blocked.");
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        entry_date: today,
        items: rows,
        cash_received: cashReceived,
        mpesa_received: mpesaReceived,
        total_sales: computed.totalSales,
        sadio_cut: computed.sadioCut,
        handover_amount: computed.handoverAmount,
        collection_difference: collectionDifference
      };

      window.localStorage.setItem(duplicateKey, JSON.stringify(payload));
      setSuccess("Daily entry saved locally (demo mode). Connect Supabase mutation for production save.");
    } catch {
      setError("Failed to save entry. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Today&apos;s Side Sales Entry</CardTitle>
          <CardDescription>Quick daily aggregate input for items and collections.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-4">
            {items.map((item) => {
              const quantity = quantities[item.id] ?? 0;

              return (
                <div key={item.id} className="rounded-lg border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <Label htmlFor={item.id} className="text-base">
                      {item.name}
                    </Label>
                    <span className="text-xs text-muted-foreground">Qty</span>
                  </div>

                  <div className="grid grid-cols-[56px_1fr_56px] items-center gap-2">
                    <Button
                      type="button"
                      size="lg"
                      variant="outline"
                      className="h-14 px-0"
                      onClick={() => setQuantity(item.id, quantity - 1)}
                      aria-label={`Decrease ${item.name}`}
                    >
                      <Minus className="h-5 w-5" />
                    </Button>
                    <Input
                      id={item.id}
                      type="number"
                      min={0}
                      step={1}
                      inputMode="numeric"
                      className="h-14 text-center text-2xl"
                      value={quantity}
                      onChange={(event) => setQuantity(item.id, parseNonNegativeNumber(event.target.value))}
                    />
                    <Button
                      type="button"
                      size="lg"
                      variant="outline"
                      className="h-14 px-0"
                      onClick={() => setQuantity(item.id, quantity + 1)}
                      aria-label={`Increase ${item.name}`}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cash">Cash received</Label>
              <Input
                id="cash"
                type="number"
                min={0}
                step={0.01}
                inputMode="decimal"
                className="h-12 text-lg"
                value={cashReceived}
                onChange={(event) => setCashReceived(parseNonNegativeNumber(event.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mpesa">M-Pesa received</Label>
              <Input
                id="mpesa"
                type="number"
                min={0}
                step={0.01}
                inputMode="decimal"
                className="h-12 text-lg"
                value={mpesaReceived}
                onChange={(event) => setMpesaReceived(parseNonNegativeNumber(event.target.value))}
              />
            </div>
          </div>

          <Button size="lg" className="w-full" disabled={isSaving} onClick={handleSubmit}>
            {isSaving ? "Saving..." : "Save Daily Entry"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Live Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Total sales</span><strong>{formatCurrency(computed.totalSales)}</strong></div>
          <div className="flex justify-between"><span>Sadio cut</span><strong>{formatCurrency(computed.sadioCut)}</strong></div>
          <div className="flex justify-between"><span>Handover amount</span><strong>{formatCurrency(computed.handoverAmount)}</strong></div>
          <div className="flex justify-between"><span>Cash entered</span><strong>{formatCurrency(cashReceived)}</strong></div>
          <div className="flex justify-between"><span>M-Pesa entered</span><strong>{formatCurrency(mpesaReceived)}</strong></div>
          <div className="flex justify-between border-t pt-2"><span>Collection difference</span><strong>{formatCurrency(collectionDifference)}</strong></div>
        </CardContent>
      </Card>

      {collectionDifference !== 0 && (
        <Alert className="border-destructive/30 bg-destructive/10 text-destructive">
          Collection mismatch: {formatCurrency(collectionDifference)}. Cash + M-Pesa should equal total sales.
        </Alert>
      )}

      {error && <Alert className="border-destructive/30 bg-destructive/10 text-destructive">{error}</Alert>}
      {success && <Alert className="border-emerald-300 bg-emerald-50 text-emerald-700">{success}</Alert>}
    </div>
  );
}
