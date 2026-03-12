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
    <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr] lg:items-start">
      <Card className="order-2 lg:order-1">
        <CardHeader className="pb-3">
          <CardTitle>Today&apos;s Side Sales Entry</CardTitle>
          <CardDescription>Quick daily aggregate input for items and collections.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2.5">
            {items.map((item) => {
              const quantity = quantities[item.id] ?? 0;

              return (
                <div key={item.id} className="rounded-lg border bg-muted/20 px-2.5 py-2 sm:px-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <Label htmlFor={item.id} className="text-sm font-medium">
                        {item.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Sell {formatCurrency(item.selling_price)} · Commission {formatCurrency(item.seller_commission)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-[40px_1fr_40px] items-center gap-2 sm:grid-cols-[44px_1fr_44px]">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 px-0"
                      onClick={() => setQuantity(item.id, quantity - 1)}
                      aria-label={`Decrease ${item.name}`}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      id={item.id}
                      type="number"
                      min={0}
                      step={1}
                      inputMode="numeric"
                      className="h-10 text-center text-lg font-semibold"
                      value={quantity}
                      onChange={(event) => setQuantity(item.id, parseNonNegativeNumber(event.target.value))}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 px-0"
                      onClick={() => setQuantity(item.id, quantity + 1)}
                      aria-label={`Increase ${item.name}`}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="cash" className="text-xs uppercase tracking-wide text-muted-foreground">
                Cash received
              </Label>
              <Input
                id="cash"
                type="number"
                min={0}
                step={0.01}
                inputMode="decimal"
                className="h-10 font-medium"
                value={cashReceived}
                onChange={(event) => setCashReceived(parseNonNegativeNumber(event.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mpesa" className="text-xs uppercase tracking-wide text-muted-foreground">
                M-Pesa received
              </Label>
              <Input
                id="mpesa"
                type="number"
                min={0}
                step={0.01}
                inputMode="decimal"
                className="h-10 font-medium"
                value={mpesaReceived}
                onChange={(event) => setMpesaReceived(parseNonNegativeNumber(event.target.value))}
              />
            </div>
          </div>

          <Button className="h-10 w-full text-sm font-semibold" disabled={isSaving} onClick={handleSubmit}>
            {isSaving ? "Saving..." : "Save Daily Entry"}
          </Button>
        </CardContent>
      </Card>

      <div className="order-1 space-y-3 lg:order-2 lg:sticky lg:top-4">
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Live Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Total sales</span><strong>{formatCurrency(computed.totalSales)}</strong></div>
            <div className="flex justify-between"><span>Sadio cut</span><strong>{formatCurrency(computed.sadioCut)}</strong></div>
            <div className="flex justify-between"><span>Handover amount</span><strong>{formatCurrency(computed.handoverAmount)}</strong></div>
            <div className="flex justify-between"><span>Cash entered</span><strong>{formatCurrency(cashReceived)}</strong></div>
            <div className="flex justify-between"><span>M-Pesa entered</span><strong>{formatCurrency(mpesaReceived)}</strong></div>
            <div className="mt-1 flex justify-between border-t pt-2">
              <span>Collection difference</span>
              <strong className={collectionDifference === 0 ? "text-emerald-600" : "text-destructive"}>
                {formatCurrency(collectionDifference)}
              </strong>
            </div>
          </CardContent>
        </Card>

        {collectionDifference !== 0 && (
          <Alert className="border-destructive/40 bg-destructive/10 text-destructive">
            <p className="font-semibold">Collection mismatch</p>
            <p className="text-sm">{formatCurrency(collectionDifference)}. Cash + M-Pesa should equal total sales.</p>
          </Alert>
        )}

        {error && <Alert className="border-destructive/30 bg-destructive/10 text-destructive">{error}</Alert>}
        {success && <Alert className="border-emerald-300 bg-emerald-50 text-emerald-700">{success}</Alert>}
      </div>
    </div>
  );
}
