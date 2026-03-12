import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { defaultItems } from "@/lib/demo-data";
import { adminLinks } from "@/lib/nav";
import { formatCurrency } from "@/lib/utils";

export default function AdminItemsPage() {
  return (
    <PageShell title="Items" links={adminLinks}>
      <Card>
        <CardHeader>
          <CardTitle>Item Pricing & Commissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Name</th>
                  <th className="py-2">Selling Price</th>
                  <th className="py-2">Unit Cost</th>
                  <th className="py-2">Commission</th>
                </tr>
              </thead>
              <tbody>
                {defaultItems.map((item) => (
                  <tr key={item.id} className="border-b last:border-b-0">
                    <td className="py-2">{item.name}</td>
                    <td>{formatCurrency(item.selling_price)}</td>
                    <td>{formatCurrency(item.unit_cost)}</td>
                    <td>{formatCurrency(item.seller_commission)}</td>
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
