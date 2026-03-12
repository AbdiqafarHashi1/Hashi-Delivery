import Link from "next/link";

export function PageShell({
  title,
  links,
  children
}: {
  title: string;
  links: { href: string; label: string }[];
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-5xl space-y-4 p-4 pb-20">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <nav className="flex flex-wrap gap-2 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full border px-3 py-1.5 hover:bg-secondary">
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <section className="space-y-4">{children}</section>
    </main>
  );
}
