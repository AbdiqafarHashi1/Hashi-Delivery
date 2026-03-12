import Link from "next/link";
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
    <main className="mx-auto w-full max-w-6xl space-y-4 px-3 py-4 pb-12 sm:px-4 lg:px-6">
      <header className="space-y-3 rounded-xl border bg-card/70 p-3 shadow-sm backdrop-blur sm:p-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>

        <nav className="flex flex-wrap gap-1.5 text-sm">
          {links.map((link) => {
            const isActive = currentPath === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm",
                  isActive ? "border-primary/20 bg-primary/10 text-primary" : "bg-background hover:bg-secondary"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <section className="space-y-4">{children}</section>
    </main>
  );
}
