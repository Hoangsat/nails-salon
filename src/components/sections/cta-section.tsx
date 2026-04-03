import Link from "next/link";

import { Container } from "@/components/layout/container";
import type { SalonProfile } from "@/types/salon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type CtaSectionProps = {
  salon: SalonProfile;
};

export function CtaSection({ salon }: CtaSectionProps) {
  return (
    <section className="pb-16 sm:pb-20">
      <Container>
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/12 via-background to-accent/20">
          <CardContent className="flex flex-col gap-6 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                Ready To Book
              </p>
              <h2 className="font-heading text-4xl font-semibold tracking-tight">
                Reserve your next visit with {salon.name}.
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                Browse live availability, choose your preferred artist, and move straight into a confirmed appointment with email follow-up.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/booking">Book now</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Contact the studio</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
