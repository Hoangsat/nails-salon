import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { mainNav } from "@/config/site";
import { getSalonThemeSettings } from "@/lib/data/public";

export async function SiteHeader() {
  const themeSettings = await getSalonThemeSettings();
  const brandName = themeSettings.brandName;

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <Container className="flex min-h-20 flex-wrap items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 font-heading text-xl font-semibold text-primary">
            {brandName.slice(0, 1)}
          </span>
          <div className="space-y-0.5">
            <p className="font-heading text-2xl font-semibold tracking-tight">{brandName}</p>
                      </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
          <Button asChild size="sm">
            <Link href="/admin">Admin</Link>
          </Button>
        </nav>
      </Container>
    </header>
  );
}
