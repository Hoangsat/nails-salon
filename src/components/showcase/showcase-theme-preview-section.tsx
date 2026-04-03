"use client";

import { useState } from "react";

import { showcaseThemePreviews } from "@/config/showcase";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

const buttonShapeClasses = {
  pill: "rounded-full",
  rounded: "rounded-2xl",
  square: "rounded-md",
};

export function ShowcaseThemePreviewSection() {
  const [activeThemeKey, setActiveThemeKey] = useState(showcaseThemePreviews[0]?.key ?? "luxury");
  const activeTheme = showcaseThemePreviews.find((theme) => theme.key === activeThemeKey) ?? showcaseThemePreviews[0];

  return (
    <section id="theme-preview" className="py-16 sm:py-20">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Theme previews"
          title="Show owners how the same product can shift between different salon aesthetics"
          description="This controlled switcher is for sales/demo use only. It previews luxury, pink, and minimal directions without changing the live salon theme configuration."
        />

        <div className="flex flex-wrap gap-3">
          {showcaseThemePreviews.map((theme) => {
            const active = theme.key === activeTheme.key;

            return (
              <button
                key={theme.key}
                type="button"
                onClick={() => setActiveThemeKey(theme.key)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/70 bg-background text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                {theme.name}
              </button>
            );
          })}
        </div>

        <Card className="overflow-hidden">
          <CardContent className="grid gap-8 p-6 lg:grid-cols-[0.88fr,1.12fr] lg:p-8">
            <div className="space-y-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Active demo</p>
                <h3 className="mt-2 font-heading text-4xl font-semibold tracking-tight text-foreground">
                  {activeTheme.name}
                </h3>
                <p className="mt-3 text-base leading-7 text-muted-foreground">{activeTheme.tagline}</p>
              </div>
              <div className="rounded-[calc(var(--radius)-0.2rem)] border border-border/70 bg-secondary/25 p-5 text-sm leading-7 text-muted-foreground">
                <p>{activeTheme.description}</p>
                <p className="mt-3">
                  Fonts: <span className="font-medium text-foreground">{activeTheme.headingFont}</span> heading / <span className="font-medium text-foreground">{activeTheme.bodyFont}</span> body
                </p>
                <p>
                  Button style: <span className="font-medium text-foreground">{activeTheme.buttonStyle}</span>
                </p>
              </div>
              <div className="flex gap-3">
                {Object.entries(activeTheme.colors).map(([name, value]) => (
                  <div key={name} className="space-y-2 text-center text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    <div className="h-12 w-12 rounded-2xl border border-border/70" style={{ backgroundColor: `hsl(${value})` }} />
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-[calc(var(--radius)+0.1rem)] border p-5 shadow-soft"
              style={{
                backgroundColor: `hsl(${activeTheme.colors.background})`,
                color: `hsl(${activeTheme.colors.foreground})`,
                borderColor: `hsl(${activeTheme.colors.secondary})`,
                borderRadius: activeTheme.borderRadius,
              }}
            >
              <div className="grid gap-5 xl:grid-cols-[1.1fr,0.9fr]">
                <div className="rounded-[inherit] border p-6" style={{ borderColor: `hsl(${activeTheme.colors.secondary})` }}>
                  <p className="text-xs uppercase tracking-[0.24em]" style={{ color: `hsl(${activeTheme.colors.primary})` }}>
                    Branded website preview
                  </p>
                  <h4 className="mt-3 text-4xl font-semibold tracking-tight">
                    A salon website owners can confidently send clients to.
                  </h4>
                  <p className="mt-4 max-w-xl text-sm leading-7" style={{ color: `hsl(${activeTheme.colors.foreground} / 0.72)` }}>
                    Direct bookings, premium presentation, and room for the salon’s own voice instead of being boxed into a generic listing template.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <div
                      className={cn("px-5 py-3 text-sm font-semibold", buttonShapeClasses[activeTheme.buttonStyle])}
                      style={{ backgroundColor: `hsl(${activeTheme.colors.primary})`, color: `hsl(${activeTheme.colors.background})` }}
                    >
                      Book online
                    </div>
                    <div
                      className={cn("border px-5 py-3 text-sm font-semibold", buttonShapeClasses[activeTheme.buttonStyle])}
                      style={{ borderColor: `hsl(${activeTheme.colors.secondary})`, backgroundColor: `hsl(${activeTheme.colors.secondary})`, color: `hsl(${activeTheme.colors.foreground})` }}
                    >
                      View services
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-[inherit] border p-5" style={{ borderColor: `hsl(${activeTheme.colors.secondary})`, backgroundColor: `hsl(${activeTheme.colors.accent} / 0.25)` }}>
                    <p className="text-sm font-semibold">Admin snapshot</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {[
                        "Bookings today",
                        "Service updates",
                        "Staff scheduling",
                        "Theme tweaks",
                      ].map((item) => (
                        <div key={item} className="rounded-2xl border px-4 py-3 text-sm" style={{ borderColor: `hsl(${activeTheme.colors.secondary})`, backgroundColor: `hsl(${activeTheme.colors.background} / 0.8)` }}>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[inherit] border p-5" style={{ borderColor: `hsl(${activeTheme.colors.secondary})` }}>
                    <p className="text-sm font-semibold">Sales talking points</p>
                    <ul className="mt-4 grid gap-3 text-sm leading-6" style={{ color: `hsl(${activeTheme.colors.foreground} / 0.72)` }}>
                      <li>Own-brand website, not a borrowed marketplace profile.</li>
                      <li>Themeable without rebuilding booking or admin flows.</li>
                      <li>Suitable for luxury, feminine, or clean modern studios.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
