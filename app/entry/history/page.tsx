import { EntryHistoryClient } from "@/components/entry-history-client";
import { PageShell } from "@/components/page-shell";

export default function EntryHistoryPage() {
  return (
    <PageShell
      title="My Entry History"
      description="Operational timeline of submitted days and collection quality."
      currentPath="/entry/history"
      links={[
        { href: "/entry/today", label: "Today" },
        { href: "/entry/history", label: "History" }
      ]}
    >
      <EntryHistoryClient />
    </PageShell>
  );
}
