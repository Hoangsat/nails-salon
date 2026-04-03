import Link from "next/link";
import { ArrowRight, CalendarCheck2, LayoutDashboard, Palette } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ShowcaseOwnerHeroSectionProps = {
  salonName: string;
  serviceCount: number;
  staffCount: number;
  reviewCount: number;
};

export function ShowcaseOwnerHeroSection({
  salonName,
  serviceCount,
  staffCount,
  reviewCount,
}: ShowcaseOwnerHeroSectionProps) {
  const stats = [
    { label: "Service menu ready", value: `${serviceCount}+` },
    { label: "Team profiles included", value: `${staffCount}` },
    { label: "Review-led trust points", value: `${reviewCount}` },
  ];

  const highlights = [
    {
      icon: CalendarCheck2,
      title: "Direct bookings on your own site",
      description: "Let clients book with your salon, not through a marketplace-first journey.",
    },
    {
      icon: LayoutDashboard,
      title: "A clean admin for day-to-day control",
      description: "Manage appointments, services, staff, working hours, and brand settings in one place.",
    },
    {
      icon: Palette,
      title: "Custom look without a rebuild",
      description: "Switch the feel between luxury, feminine, and minimal while keeping the same product foundation.",
    },
  ];

  return (
    <section className="overflow-hidden py-16 sm:py-20 lg:py-24">
      <Container className="grid gap-10 lg:grid-cols-[1.05fr,0.95fr] lg:items-center">
        <div className="space-y-7">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
            For Salon Owners
          </p>
          <div className="space-y-4">
            <h1 className="max-w-4xl font-heading text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Sell a salon website that looks premium, books directly, and stays in the owner’s control.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              This product packages the polish of {salonName} with real booking, admin management, theme controls, and email confirmations so it feels like a credible service for UK salons, not just a front-end mock-up.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="#demo-request">Request a demo</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/booking">
                Preview booking flow
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-[calc(var(--radius)+0.1rem)] border border-border/70 bg-card/70 p-4 shadow-soft">
                <p className="text-3xl font-semibold text-foreground">{stat.value}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="overflow-hidden border-primary/15 bg-gradient-to-br from-primary/12 via-background to-accent/22">
          <CardContent className="space-y-6 p-7 sm:p-8">
            <div className="rounded-[calc(var(--radius)+0.1rem)] border border-border/70 bg-background/85 p-5 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Sales-ready demo</p>
                  <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground">
                    A product owners can picture running
                  </h2>
                </div>
                <div className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  Direct-first
                </div>
              </div>
              <div className="mt-5 grid gap-4">
                {highlights.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="rounded-3xl border border-border/70 bg-card/80 p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/12 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">{item.title}</p>
                          <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Button asChild variant="outline" className="justify-between">
                <Link href="/admin">Preview admin</Link>
              </Button>
              <Button asChild variant="outline" className="justify-between">
                <Link href="/services">Preview services</Link>
              </Button>
              <Button asChild variant="outline" className="justify-between">
                <Link href="#theme-preview">Preview themes</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
