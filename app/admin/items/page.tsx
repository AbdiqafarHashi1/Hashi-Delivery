"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getLedgerState, upsertItem } from "@/lib/ledger-store";
import { adminLinks } from "@/lib/nav";
import { formatCurrency } from "@/lib/utils";

export default function AdminItemsPage() {
  const [state, setState] = useState(getLedgerState());
  const [draft, setDraft] = useState({ id: "", name: "", selling_price: 0, unit_cost: 0, seller_commission: 0, is_active: true });

  useEffect(() => {
    const sync = () => setState(getLedgerState());
    window.addEventListener("ledger-state-updated", sync);
    return () => window.removeEventListener("ledger-state-updated", sync);
  }, []);

  return (
    <PageShell title="Items" description="Pricing, unit costs, commissions and active status controls." currentPath="/admin/items" links={adminLinks}>
      <Card>
        <CardHeader><CardTitle>Item Controls</CardTitle></CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-6">
          <Input placeholder="Name" value={draft.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} />
          <Input type="number" placeholder="Selling" value={draft.selling_price} onChange={(e) => setDraft((p) => ({ ...p, selling_price: Number(e.target.value) || 0 }))} />
          <Input type="number" placeholder="Unit Cost" value={draft.unit_cost} onChange={(e) => setDraft((p) => ({ ...p, unit_cost: Number(e.target.value) || 0 }))} />
          <Input type="number" placeholder="Commission" value={draft.seller_commission} onChange={(e) => setDraft((p) => ({ ...p, seller_commission: Number(e.target.value) || 0 }))} />
          <Input placeholder="active/inactive" value={draft.is_active ? "active" : "inactive"} onChange={(e) => setDraft((p) => ({ ...p, is_active: e.target.value !== "inactive" }))} />
          <Button onClick={() => upsertItem({ ...draft, id: draft.id || undefined }, "Admin")}>{draft.id ? "Update" : "Create"}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Item Pricing & Commissions</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {state.items.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between rounded-lg border border-border/60 bg-muted/30 p-3 text-sm">
              <p className="font-medium">{item.name}</p>
              <p>{formatCurrency(item.selling_price)} · Cost {formatCurrency(item.unit_cost)} · Comm {formatCurrency(item.seller_commission)}</p>
              <p>{item.is_active ? "Active" : "Inactive"}</p>
              <Button variant="outline" size="sm" onClick={() => setDraft(item)}>Edit</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  );
}
