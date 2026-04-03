import Link from "next/link";
import { ArrowUpRight, Facebook, Instagram, MessageCircle } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ContactShowcaseSectionProps = {
  salon: {
    name: string;
    phone: string | null;
    email: string | null;
    websiteUrl: string | null;
    instagramUrl: string | null;
    addressLine1: string | null;
    city: string | null;
    region: string | null;
    postalCode: string | null;
    bookingNotice: string | null;
  };
  workingHours: string[];
};

function slugifyHandle(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 40);
}

function buildWhatsappLink(phone: string | null) {
  if (!phone) {
    return "#";
  }

  const digits = phone.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "#";
}

function buildFacebookLink(name: string) {
  return `https://facebook.com/${slugifyHandle(name)}`;
}

export function ContactShowcaseSection({ salon, workingHours }: ContactShowcaseSectionProps) {
  const quickActions = [
    {
      label: "WhatsApp",
      href: buildWhatsappLink(salon.phone),
      helper: salon.phone ?? "Message the salon",
      icon: MessageCircle,
    },
    {
      label: "Facebook",
      href: buildFacebookLink(salon.name),
      helper: `${salon.name} on Facebook`,
      icon: Facebook,
    },
    {
      label: "Instagram",
      href: salon.instagramUrl ?? "#",
      helper: salon.instagramUrl ? "View latest work and updates" : "Instagram profile",
      icon: Instagram,
    },
  ];

  return (
    <section className="py-16 sm:py-20">
      <Container className="grid gap-6 lg:grid-cols-[0.95fr,1.05fr]">
        <Card className="overflow-hidden bg-secondary/30">
          <CardHeader>
            <CardDescription>Visit the studio</CardDescription>
            <CardTitle className="text-3xl">{salon.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-[calc(var(--radius)-0.4rem)] border border-border/70 bg-background/80 p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Location</p>
              <p className="mt-3 text-base leading-7 text-foreground">
                {[salon.addressLine1, salon.city, salon.region, salon.postalCode].filter(Boolean).join(", ")}
              </p>
            </div>
            <div className="rounded-[calc(var(--radius)-0.4rem)] border border-border/70 bg-gradient-to-br from-primary/10 via-background to-accent/15 p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Map Preview</p>
              <div className="mt-4 flex aspect-[4/3] items-end rounded-[calc(var(--radius)-0.4rem)] border border-border/70 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.9),transparent_30%),linear-gradient(135deg,rgba(233,125,108,0.15),rgba(244,193,199,0.35),rgba(255,255,255,0.8))] p-5">
                <div className="rounded-2xl bg-background/90 px-4 py-3 text-sm shadow-soft">
                  Ready for a live map embed or real studio location photo.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardDescription>Contact</CardDescription>
                <CardTitle>Reach the studio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
                <p>{salon.phone ?? "Phone placeholder"}</p>
                <p>{salon.email ?? "Email placeholder"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>Quick links</CardDescription>
                <CardTitle>Message or follow instantly</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {quickActions.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm text-foreground transition-colors hover:bg-secondary/55"
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block font-medium text-foreground">{link.label}</span>
                          <span className="block text-xs text-muted-foreground">{link.helper}</span>
                        </span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardDescription>Opening hours</CardDescription>
              <CardTitle>Plan your visit</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm leading-7 text-muted-foreground sm:grid-cols-2">
              {workingHours.map((entry) => (
                <div key={entry} className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
                  {entry}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/15">
            <CardHeader>
              <CardDescription>Booking CTA</CardDescription>
              <CardTitle>Ready to reserve your appointment?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="leading-7 text-muted-foreground">{salon.bookingNotice}</p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/booking">Go to booking page</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/gallery">See portfolio first</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}
