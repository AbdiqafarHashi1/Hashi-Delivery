import { AccountsClient } from "@/components/accounts-client";
import { PageShell } from "@/components/page-shell";
import { adminLinks } from "@/lib/nav";

export default function AdminAccountsPage() {
  return (
    <PageShell title="Accounts" description="Live balances, adjustments and account movement history." currentPath="/admin/accounts" links={adminLinks}>
      <AccountsClient />
    </PageShell>
  );
}
