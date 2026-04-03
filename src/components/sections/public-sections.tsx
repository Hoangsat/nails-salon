import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { formatAddonPrice, formatDuration, formatPriceFrom } from "@/lib/data/formatters";
import { groupServicesByCategory } from "@/lib/data/selectors";
import type { SalonService } from "@/types/salon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

type ServicesCatalogueSectionProps = {
  services: SalonService[];
  currencyCode: string;
};

export function ServicesCatalogueSection({
  services,
  currencyCode,
}: ServicesCatalogueSectionProps) {
  const groups = groupServicesByCategory(services);

  return (
    <section className="py-16 sm:py-20">
      <Container className="space-y-12">
        {groups.map((group) => (
          <div key={group.category} className="space-y-6">
            <div className="flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                  {group.category}
                </p>
                <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                  {group.category} services
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                Clear pricing, duration, and add-on structure help the service menu feel organized and sales-ready.
              </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              {group.services.map((service) => (
                <Card key={service.id} className="h-full overflow-hidden">
                  <CardHeader className="space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-2">
                        <CardTitle className="text-2xl">{service.name}</CardTitle>
                        <CardDescription>{service.shortDescription ?? service.description}</CardDescription>
                      </div>
                      <div className="rounded-full bg-secondary/55 px-4 py-2 text-sm font-medium text-foreground">
                        {formatPriceFrom(service.priceFromCents, currencyCode)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span className="rounded-full border border-border/70 px-3 py-1">
                        {formatDuration(service.durationMinutes)}
                      </span>
                      <span className="rounded-full border border-border/70 px-3 py-1">
                        {service.staffIds.length} staff available
                      </span>
                      {service.isFeatured ? (
                        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary">
                          Featured
                        </span>
                      ) : null}
                    </div>

                    <p className="leading-7 text-muted-foreground">{service.description}</p>

                    {service.addons.length ? (
                      <div className="rounded-[calc(var(--radius)-0.4rem)] bg-secondary/35 p-4">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Available add-ons
                        </p>
                        <div className="mt-3 space-y-3">
                          {service.addons.map((addon) => (
                            <div
                              key={addon.id}
                              className="flex flex-col gap-1 rounded-2xl bg-background/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                            >
                              <div>
                                <p className="font-medium text-foreground">{addon.name}</p>
                                <p className="text-sm text-muted-foreground">{addon.description}</p>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                + {formatAddonPrice(addon.priceCents, currencyCode)} / {formatDuration(addon.durationMinutes)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}

type GalleryShowcaseSectionProps = {
  items: Array<{
    id: string;
    title: string;
    description: string | null;
    imageUrl: string;
    altText: string | null;
    category: string | null;
  }>;
};

export function GalleryShowcaseSection({ items }: GalleryShowcaseSectionProps) {
  return (
    <section className="py-16 sm:py-20">
      <Container className="space-y-8">
        <SectionHeading
          eyebrow="Portfolio"
          title="A stronger portfolio-style gallery built from the structured image set"
          description="Image assets, categories, and captions now come from the gallery data layer while the presentation is tuned to feel more like a polished salon portfolio."
        />

        <div className="grid auto-rows-[220px] gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => (
            <Card
              key={item.id}
              className={`${index % 3 === 0 ? "md:row-span-2" : ""} overflow-hidden`}
            >
              <div className="relative h-full min-h-[220px]">
                <Image
                  src={item.imageUrl}
                  alt={item.altText ?? item.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 via-foreground/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-background">
                  <p className="text-xs uppercase tracking-[0.24em] opacity-80">
                    {item.category ?? "Portfolio image"}
                  </p>
                  <h3 className="mt-2 font-heading text-3xl font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-background/85">
                    {item.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

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

export function ContactShowcaseSection({ salon, workingHours }: ContactShowcaseSectionProps) {
  const socialLinks = [
    { label: "Instagram", href: salon.instagramUrl ?? "#" },
    { label: "Website", href: salon.websiteUrl ?? "#" },
    { label: "Pinterest", href: "#" },
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
                  Demo location block for future embedded map integration.
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
                <CardDescription>Socials</CardDescription>
                <CardTitle>Stay in the loop</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
                {socialLinks.map((link) => (
                  <Link key={link.label} href={link.href} className="block hover:text-foreground">
                    {link.label}
                  </Link>
                ))}
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
              <CardTitle>Ready when the live booking flow is</CardTitle>
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

type BookingShellSectionProps = {
  salonName: string;
  currencyCode: string;
  services: Array<{
    id: string;
    name: string;
    category: string;
    priceFromCents: number;
    durationMinutes: number;
  }>;
  staff: Array<{
    id: string;
    displayName: string;
    role: string;
    profileImageUrl: string | null;
  }>;
};

export function BookingShellSection({
  salonName,
  currencyCode,
  services,
  staff,
}: BookingShellSectionProps) {
  const selectedService = services[0];
  const selectedStaff = staff[0];

  return (
    <section className="py-16 sm:py-20">
      <Container className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardDescription>1. Choose a service</CardDescription>
              <CardTitle>Service selection shell</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`rounded-[calc(var(--radius)-0.4rem)] border p-4 ${service.id === selectedService?.id ? "border-primary bg-primary/5" : "border-border/70 bg-background/80"}`}
                >
                  <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">{service.category}</p>
                  <p className="mt-2 font-medium text-foreground">{service.name}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {formatPriceFrom(service.priceFromCents, currencyCode)} / {formatDuration(service.durationMinutes)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>2. Choose your artist</CardDescription>
              <CardTitle>Staff selection shell</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {staff.map((member) => (
                <div
                  key={member.id}
                  className={`rounded-[calc(var(--radius)-0.4rem)] border p-4 ${member.id === selectedStaff?.id ? "border-primary bg-primary/5" : "border-border/70 bg-background/80"}`}
                >
                  <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-secondary/50">
                    {member.profileImageUrl ? (
                      <Image
                        src={member.profileImageUrl}
                        alt={member.displayName}
                        fill
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <p className="font-medium text-foreground">{member.displayName}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardDescription>3. Select date & time</CardDescription>
                <CardTitle>Availability placeholder shell</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                  {["Tue 14", "Wed 15", "Thu 16", "Fri 17", "Sat 18", "Mon 20"].map((slot) => (
                    <div key={slot} className="rounded-xl border border-border/70 bg-background/80 px-3 py-3 text-center">
                      {slot}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                  {["10:00", "11:30", "13:00", "14:30", "16:00", "17:30"].map((time) => (
                    <div key={time} className="rounded-xl border border-border/70 bg-background/80 px-3 py-3 text-center">
                      {time}
                    </div>
                  ))}
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  Live slot calculation is intentionally deferred to the next phase.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>4. Guest details</CardDescription>
                <CardTitle>Customer form shell</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Full name",
                  "Email address",
                  "Phone number",
                  "Notes for the studio",
                ].map((label) => (
                  <label key={label} className="block space-y-2">
                    <span className="text-sm font-medium text-foreground">{label}</span>
                    {label === "Notes for the studio" ? (
                      <textarea
                        className="min-h-28 w-full rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm text-muted-foreground"
                        placeholder="UI shell only for now"
                        readOnly
                      />
                    ) : (
                      <input
                        className="h-12 w-full rounded-2xl border border-border/70 bg-background/80 px-4 text-sm text-muted-foreground"
                        placeholder="UI shell only for now"
                        readOnly
                      />
                    )}
                  </label>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-24 border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/15">
            <CardHeader>
              <CardDescription>Booking summary</CardDescription>
              <CardTitle>{salonName} appointment preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
              <div className="rounded-2xl bg-background/85 p-4">
                <p className="font-medium text-foreground">Selected service</p>
                <p>{selectedService?.name}</p>
              </div>
              <div className="rounded-2xl bg-background/85 p-4">
                <p className="font-medium text-foreground">Selected staff</p>
                <p>{selectedStaff?.displayName}</p>
              </div>
              <div className="rounded-2xl bg-background/85 p-4">
                <p className="font-medium text-foreground">Estimated total</p>
                <p>{selectedService ? formatPriceFrom(selectedService.priceFromCents, currencyCode) : "TBC"}</p>
              </div>
              <div className="rounded-2xl border border-dashed border-border/80 px-4 py-4">
                Submission, validation, slot locking, and database writes are intentionally not implemented in this phase.
              </div>
              <Button className="w-full" disabled>
                Continue to confirmation (next phase)
              </Button>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}

type BookingSuccessShellSectionProps = {
  salonName: string;
  email: string | null;
};

export function BookingSuccessShellSection({
  salonName,
  email,
}: BookingSuccessShellSectionProps) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <Card className="mx-auto max-w-3xl border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/18">
          <CardHeader className="text-center">
            <CardDescription>Success page shell</CardDescription>
            <CardTitle className="text-4xl">Your request looks beautifully on-brand</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="mx-auto max-w-2xl leading-7 text-muted-foreground">
              This confirmation screen is intentionally UI-only for now. In the next phase it can be connected to a real booking submission, confirmation email, and notification flow for {salonName}.
            </p>
            <div className="rounded-[calc(var(--radius)-0.4rem)] bg-background/85 p-5 text-sm text-muted-foreground">
              Demo confirmation destination: {email ?? "studio inbox"}
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href="/booking">Back to booking</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/services">Review services again</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
