import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPriceFrom } from "@/lib/data/formatters";
import type { GalleryImage, SalonProfile, SalonService, SalonThemeSettings, StaffMember } from "@/types/salon";

type HeroSectionProps = {
  salon: SalonProfile;
  themeSettings: Pick<SalonThemeSettings, "brandName" | "heroImageUrl" | "heroImageAlt">;
  services: SalonService[];
  staff: StaffMember[];
  gallery: Pick<GalleryImage, "id" | "title" | "imageUrl" | "altText" | "category">[];
};

export function HeroSection({ salon, themeSettings, services, staff, gallery }: HeroSectionProps) {
  const primaryImage = themeSettings.heroImageUrl ?? gallery[0]?.imageUrl ?? "/images/gallery-minimal.svg";
  const primaryAlt = themeSettings.heroImageAlt ?? gallery[0]?.altText ?? themeSettings.brandName;
  const supportingImages = gallery.slice(0, 3);

  return (
    <section className="relative overflow-hidden border-b border-border/60 py-14 sm:py-20 lg:py-24">
      <div className="absolute inset-0 -z-10 bg-grid-fade bg-[size:32px_32px] opacity-35" />
      <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-accent/25 to-transparent" />
      <Container className="grid items-center gap-10 lg:grid-cols-[1.02fr,0.98fr]">
        <div className="space-y-8">
          <div className="space-y-4">
            <Badge variant="outline">Premium nail studio website</Badge>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              {salon.tagline ?? "Refined nail artistry for modern guests"}
            </p>
            <h1 className="max-w-3xl text-balance font-heading text-5xl font-semibold tracking-tight text-foreground sm:text-6xl xl:text-7xl">
              Precision manicures, polished pedicures, and design-led details guests will actually book.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">{salon.description}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/booking">Book your appointment</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/gallery">View recent work</Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="bg-background/80">
              <CardContent className="p-5">
                <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Service Menu</p>
                <p className="mt-2 font-heading text-3xl font-semibold">{services.length}+</p>
              </CardContent>
            </Card>
            <Card className="bg-background/80">
              <CardContent className="p-5">
                <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Specialists</p>
                <p className="mt-2 font-heading text-3xl font-semibold">{staff.length}</p>
              </CardContent>
            </Card>
            <Card className="bg-background/80">
              <CardContent className="p-5">
                <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Contact</p>
                <p className="mt-2 text-sm font-medium text-foreground">{salon.phone}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="relative overflow-hidden border-primary/20 bg-background/92 shadow-soft">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[calc(var(--radius)+0.1rem)]">
              <Image
                src={primaryImage}
                alt={primaryAlt}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/45 via-foreground/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-background sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-background/80">
                  Editorial studio imagery
                </p>
                <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                  Close-up nail detail, polish texture, and studio atmosphere take the lead in this opening frame.
                </h2>
              </div>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-[0.92fr,1.08fr]">
            <Card className="bg-secondary/35">
              <CardContent className="space-y-3 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Featured service</p>
                <p className="font-heading text-3xl font-semibold text-foreground">
                  {services[0]?.name ?? "Signature manicure"}
                </p>
                {services[0] ? (
                  <p className="text-sm leading-6 text-muted-foreground">
                    {formatPriceFrom(services[0].priceFromCents, salon.currencyCode)} / {services[0].durationMinutes} min tailored session
                  </p>
                ) : null}
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-3">
              {supportingImages.map((item) => (
                <div key={item.id} className="relative aspect-[3/4] overflow-hidden rounded-[calc(var(--radius)-0.1rem)] border border-border/70 bg-secondary/40">
                  <Image src={item.imageUrl} alt={item.altText ?? item.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-background/85">
                    {item.category ?? "Portfolio"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
