import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminLinks } from "@/lib/nav";

export default function AdminProfitSharingPage() {
  return (
    <PageShell
      title="Profit Sharing"
      description="Reference formulas used for side-sales allocations."
      currentPath="/admin/profit-sharing"
      links={adminLinks}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Rule Formula</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p><span className="font-medium text-foreground">1)</span> total_sales = sum(quantity × selling_price)</p>
          <p><span className="font-medium text-foreground">2)</span> sadio_cut = sum(quantity × seller_commission)</p>
          <p><span className="font-medium text-foreground">3)</span> post_commission_pool = total_sales - sadio_cut</p>
          <p><span className="font-medium text-foreground">4)</span> gross shares = 50/50 split of post commission pool</p>
          <p><span className="font-medium text-foreground">5)</span> total_cogs deducted only from restaurant side</p>
        </CardContent>
      </Card>
    </PageShell>
  );
}
