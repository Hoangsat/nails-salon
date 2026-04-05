import Link from "next/link";

import { Container } from "@/components/layout/container";
import { footerNav } from "@/config/site";
import { getSalonThemeSettings } from "@/lib/data/public";

export async function SiteFooter() {
  const themeSettings = await getSalonThemeSettings();

  return (
    <footer className="border-t border-border/70 bg-secondary/30">
      <Container className="grid gap-8 py-12 md:grid-cols-[1.4fr,1fr] md:items-end">
        <div className="space-y-4">
          <p className="font-heading text-3xl font-semibold tracking-tight">
            {themeSettings.brandName}
          </p>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Book appointments online, browse the latest services, and contact the studio quickly from one simple salon website.
          </p>
        </div>

        <div className="space-y-4 md:justify-self-end md:text-right">
          <div className="flex flex-wrap gap-4 md:justify-end">
            {footerNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.title}
              </Link>
            ))}
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
Online booking and confirmation emails available
          </p>
        </div>
      </Container>
    </footer>
  );
}
