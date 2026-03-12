import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminLinks } from "@/lib/nav";
import { formatCurrency } from "@/lib/utils";

const dashboardSections = [
  {
    title: "Sales Summary",
    cards: [
      { label: "Total Sales", value: 14050 },
      { label: "Post Commission Pool", value: 12628 }
    ]
  },
  {
    title: "Commission Summary",
    cards: [
      { label: "Sadio Commission", value: 1422 },
      { label: "Total COGS", value: 2940 }
    ]
  },
  {
    title: "Allocation Summary",
    cards: [
      { label: "Restaurant Gross Share", value: 6314 },
      { label: "Partner Gross Share", value: 6314 },
      { label: "Restaurant Net Share", value: 3374 },
      { label: "Partner Final Share", value: 6314 }
    ]
  },
  {
    title: "Account Balances",
    cards: [
      { label: "Cash Balance", value: 8900 },
      { label: "M-Pesa Balance", value: 5150 }
    ]
  }
];

export default function AdminDashboardPage() {
  return (
    <PageShell title="Admin Dashboard" links={adminLinks}>
      <div className="space-y-5">
        {dashboardSections.map((section) => (
          <section key={section.title} className="space-y-3">
            <h2 className="text-lg font-semibold">{section.title}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {section.cards.map((card) => (
                <Card key={card.label}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-semibold">{formatCurrency(card.value)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accounting Rule Reminder</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          Partner share comes from the post commission pool and is never reduced by COGS.
        </CardContent>
      </Card>
    </PageShell>
  );
}
