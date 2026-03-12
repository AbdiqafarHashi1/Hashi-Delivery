import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { defaultItems } from "@/lib/demo-data";
import { adminLinks } from "@/lib/nav";
import { formatCurrency } from "@/lib/utils";

export default function AdminItemsPage() {
  return (
    <PageShell
      title="Items"
      description="Pricing, unit costs, and seller commissions."
      currentPath="/admin/items"
      links={adminLinks}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Item Pricing & Commissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="hidden overflow-x-auto rounded-lg border sm:block">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-left">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Selling Price</th>
                  <th className="px-3 py-2">Unit Cost</th>
                  <th className="px-3 py-2">Commission</th>
                </tr>
              </thead>
              <tbody>
                {defaultItems.map((item) => (
                  <tr key={item.id} className="border-t last:border-b-0">
                    <td className="px-3 py-2.5 font-medium">{item.name}</td>
                    <td className="px-3 py-2.5">{formatCurrency(item.selling_price)}</td>
                    <td className="px-3 py-2.5">{formatCurrency(item.unit_cost)}</td>
                    <td className="px-3 py-2.5">{formatCurrency(item.seller_commission)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-2 sm:hidden">
            {defaultItems.map((item) => (
              <div key={item.id} className="rounded-lg border p-3 text-sm">
                <p className="font-medium">{item.name}</p>
                <p className="text-muted-foreground">Selling: {formatCurrency(item.selling_price)}</p>
                <p className="text-muted-foreground">Cost: {formatCurrency(item.unit_cost)}</p>
                <p className="text-muted-foreground">Commission: {formatCurrency(item.seller_commission)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
