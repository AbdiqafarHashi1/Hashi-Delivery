import { Info } from "lucide-react";
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
    title: "Commission & COGS",
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
    <PageShell
      title="Admin Dashboard"
      description="Finance and operations snapshot for side-sales activity."
      currentPath="/admin/dashboard"
      links={adminLinks}
    >
      <div className="space-y-4">
        {dashboardSections.map((section) => (
          <section key={section.title} className="space-y-2.5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{section.title}</h2>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
              {section.cards.map((card) => (
                <Card key={card.label} className="border-muted/70 shadow-sm">
                  <CardHeader className="pb-1.5">
                    <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {card.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold tracking-tight sm:text-3xl">{formatCurrency(card.value)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>

      <Card className="border-sky-200 bg-sky-50/70">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm text-sky-900">
            <Info className="h-4 w-4" />
            Accounting Rule Reminder
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-sky-900">
          Partner share comes from the post commission pool and is never reduced by COGS.
        </CardContent>
      </Card>
    </PageShell>
  );
}
