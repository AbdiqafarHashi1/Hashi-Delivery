import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { defaultItems } from "@/lib/demo-data";
import { adminLinks } from "@/lib/nav";
import { formatCurrency } from "@/lib/utils";

export default function AdminItemsPage() {
  return (
    <PageShell title="Items" description="Pricing, unit costs, commissions and active status controls." currentPath="/admin/items" links={adminLinks}>
      <Card>
        <CardHeader><CardTitle>Item Controls</CardTitle></CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-4">
          <Input placeholder="Search item" />
          <Input type="date" />
          <Button variant="outline">Show Active</Button>
          <Button>Add New Item</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Item Pricing & Commissions</CardTitle></CardHeader>
        <CardContent>
          <div className="hidden overflow-x-auto rounded-xl border border-border/70 md:block">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr className="text-left">
                  <th className="px-3 py-2">Name</th><th className="px-3 py-2">Selling Price</th><th className="px-3 py-2">Unit Cost</th><th className="px-3 py-2">Commission</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {defaultItems.map((item, idx) => (
                  <tr key={item.id} className="border-t border-border/60">
                    <td className="px-3 py-2.5 font-medium">{item.name}</td>
                    <td className="px-3 py-2.5">{formatCurrency(item.selling_price)}</td>
                    <td className="px-3 py-2.5">{formatCurrency(item.unit_cost)}</td>
                    <td className="px-3 py-2.5">{formatCurrency(item.seller_commission)}</td>
                    <td className="px-3 py-2.5"><span className="rounded-full border px-2 py-1 text-xs">{idx % 3 === 0 ? "Inactive" : "Active"}</span></td>
                    <td className="px-3 py-2.5"><Button variant="outline" size="sm">Update Commission</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-2 md:hidden">
            {defaultItems.map((item, idx) => (
              <div key={item.id} className="rounded-xl border border-border/70 bg-muted/30 p-3 text-sm">
                <p className="font-medium">{item.name}</p>
                <p className="text-muted-foreground">Selling: {formatCurrency(item.selling_price)} · Cost: {formatCurrency(item.unit_cost)}</p>
                <p className="text-muted-foreground">Commission: {formatCurrency(item.seller_commission)} · {idx % 3 === 0 ? "Inactive" : "Active"}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
