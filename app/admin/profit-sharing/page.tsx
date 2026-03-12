import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminLinks } from "@/lib/nav";

export default function AdminProfitSharingPage() {
  return (
    <PageShell title="Profit Sharing" links={adminLinks}>
      <Card>
        <CardHeader><CardTitle>Rule Formula</CardTitle></CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>1) total_sales = sum(quantity × selling_price)</p>
          <p>2) sadio_cut = sum(quantity × seller_commission)</p>
          <p>3) post_commission_pool = total_sales - sadio_cut</p>
          <p>4) gross shares = 50/50 split of post commission pool</p>
          <p>5) total_cogs deducted only from restaurant side</p>
        </CardContent>
      </Card>
    </PageShell>
  );
}
