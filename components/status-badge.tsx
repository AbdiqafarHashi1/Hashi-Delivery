import { EntryStatus } from "@/lib/ledger-store";

const classes: Record<EntryStatus, string> = {
  open: "border-slate-500/40 bg-slate-900/40 text-slate-200",
  submitted: "border-blue-500/40 bg-blue-900/30 text-blue-200",
  locked: "border-destructive/40 bg-destructive/15 text-destructive",
  reopened: "border-amber-500/40 bg-amber-900/30 text-amber-200",
  reviewed: "border-emerald-500/40 bg-emerald-900/30 text-emerald-200"
};

export function StatusBadge({ status }: { status: EntryStatus }) {
  return <span className={`rounded-md border px-2 py-1 text-xs font-semibold uppercase tracking-wide ${classes[status]}`}>{status}</span>;
}
