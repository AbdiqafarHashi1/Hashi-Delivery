import Link from "next/link";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageShell({
  title,
  description,
  links,
  currentPath,
  children
}: {
  title: string;
  description?: string;
  links: { href: string; label: string }[];
  currentPath?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-7xl px-3 py-4 pb-12 sm:px-5 lg:px-8">
      <div className="mb-3 rounded-2xl border border-border/80 bg-card/80 p-3 sm:hidden">
        <details>
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
            <span className="flex items-center gap-2"><Menu className="h-4 w-4" /> Navigation</span>
          </summary>
          <nav className="mt-3 grid gap-1.5">
            {links.map((link) => {
              const isActive = currentPath === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm",
                    isActive ? "border-primary/50 bg-primary/20 text-primary" : "border-border/60 bg-background/70"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </details>
      </div>

      <div className="grid gap-4 lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="sticky top-4 hidden h-fit rounded-2xl border border-border/80 bg-card/80 p-3 lg:block">
          <p className="mb-3 px-2 text-xs uppercase tracking-[0.2em] text-primary">Operations</p>
          <nav className="grid gap-1.5">
            {links.map((link) => {
              const isActive = currentPath === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm font-medium transition",
                    isActive
                      ? "border-primary/50 bg-primary/20 text-primary"
                      : "border-transparent text-muted-foreground hover:border-border/70 hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="space-y-4">
          <header className="rounded-2xl border border-border/80 bg-card/80 p-4 sm:p-5">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
            {description && <p className="mt-1 text-sm text-muted-foreground sm:text-base">{description}</p>}
          </header>
          <section className="space-y-4">{children}</section>
        </div>
      </div>
    </main>
  );
}
