import { PageShell } from "@/components/page-shell";
import { SellerEntryPageClient } from "@/components/seller-entry-page-client";

export default function EntryTodayPage() {
  return (
    <PageShell
      title="Seller Entry"
      description="Record today's side sales quickly with live totals and collection checks."
      currentPath="/entry/today"
      links={[
        { href: "/entry/today", label: "Today" },
        { href: "/entry/history", label: "History" }
      ]}
    >
      <SellerEntryPageClient />
    </PageShell>
  );
}
