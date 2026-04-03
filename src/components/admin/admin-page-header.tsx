import type { PropsWithChildren } from "react";

import { Badge } from "@/components/ui/badge";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  badge,
  children,
}: PropsWithChildren<{
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
}>) {
  return (
    <div className="rounded-[calc(var(--radius)+0.2rem)] border border-border/70 bg-card/90 p-6 shadow-soft backdrop-blur-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {title}
            </h1>
            {badge ? <Badge variant="outline">{badge}</Badge> : null}
          </div>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground">{description}</p>
        </div>
        {children ? <div className="flex flex-wrap gap-3">{children}</div> : null}
      </div>
    </div>
  );
}
