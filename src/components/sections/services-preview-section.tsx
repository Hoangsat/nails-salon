import Link from "next/link";

import { Container } from "@/components/layout/container";
import { formatDuration, formatPriceFrom } from "@/lib/data/formatters";
import type { SalonService } from "@/types/salon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

type ServicesPreviewSectionProps = {
  services: SalonService[];
  currencyCode: string;
};

export function ServicesPreviewSection({
  services,
  currencyCode,
}: ServicesPreviewSectionProps) {
  return (
    <section className="py-16 sm:py-20">
      <Container className="space-y-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Featured Services"
            title="Popular services at a glance"
            description="Browse some of the most-booked treatments first, with clear pricing and timing before moving into the full service menu."
          />
          <Button asChild variant="outline">
            <Link href="/services">Browse full service menu</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="h-full overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-primary via-accent to-secondary" />
              <CardHeader>
                <CardDescription>
                  {service.category} / {formatDuration(service.durationMinutes)}
                </CardDescription>
                <CardTitle>{service.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="leading-7 text-muted-foreground">
                  {service.shortDescription ?? service.description}
                </p>
                <div className="flex items-center justify-between rounded-[calc(var(--radius)-0.4rem)] bg-secondary/55 px-4 py-3 text-sm">
                  <span className="font-medium text-foreground">Starting from</span>
                  <span className="text-muted-foreground">
                    {formatPriceFrom(service.priceFromCents, currencyCode)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
