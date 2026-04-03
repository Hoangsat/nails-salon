import Link from "next/link";
import { Award, ShieldCheck, Sparkles, Star } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatPriceFrom } from "@/lib/data/formatters";
import { getAverageReviewRating } from "@/lib/data/selectors";
import type { Review, SalonProfile, SalonService, StaffMember } from "@/types/salon";

type ValuePropositionSectionProps = {
  salon: SalonProfile;
  featuredServices: SalonService[];
  staff: StaffMember[];
  reviews: Review[];
};

const valueCards = [
  {
    icon: ShieldCheck,
    title: "High-finish hygiene standards",
    description:
      "Presentation, prep, and aftercare are framed like premium studio standards from the first touchpoint onward.",
  },
  {
    icon: Sparkles,
    title: "Refined design direction",
    description:
      "Built for clean polish work, soft editorial colour stories, and portfolio-ready finishing details.",
  },
  {
    icon: Award,
    title: "Specialist-led service menu",
    description:
      "Structured around the kind of focused treatments guests actually compare when choosing a salon.",
  },
] as const;

export function ValuePropositionSection({
  salon,
  featuredServices,
  staff,
  reviews,
}: ValuePropositionSectionProps) {
  const averageRating = getAverageReviewRating(reviews);

  return (
    <section className="py-16 sm:py-20">
      <Container className="space-y-10">
        <div className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr] lg:items-end">
          <SectionHeading
            eyebrow="Studio Value"
            title="A salon experience that feels premium, credible, and ready to convert"
            description={`${salon.name} presents like a real modern studio: coherent services, social proof, confident positioning, and a booking path guests can actually complete.`}
          />

          <Card className="bg-secondary/35">
            <CardContent className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Featured Services</p>
                <p className="mt-2 font-heading text-4xl font-semibold">{featuredServices.length}</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Specialist Staff</p>
                <p className="mt-2 font-heading text-4xl font-semibold">{staff.length}</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Average Review</p>
                <p className="mt-2 flex items-center gap-2 font-heading text-4xl font-semibold">
                  {averageRating.toFixed(1)}
                  <Star className="h-5 w-5 fill-primary text-primary" />
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="grid gap-6 md:grid-cols-3">
            {valueCards.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="h-full bg-background/80">
                  <CardHeader className="space-y-4">
                    <Badge variant="outline" className="w-fit">
                      <Icon className="mr-2 h-4 w-4" />
                      Premium Standard
                    </Badge>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-7 text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/15">
            <CardHeader>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Popular Starting Point</p>
              <CardTitle className="text-3xl">{featuredServices[0]?.name ?? "Signature Service"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-7 text-muted-foreground">
                {featuredServices[0]?.description ?? salon.description}
              </p>
              {featuredServices[0] ? (
                <div className="rounded-[calc(var(--radius)-0.4rem)] bg-background/80 p-4 text-sm text-muted-foreground">
                  {formatPriceFrom(featuredServices[0].priceFromCents, salon.currencyCode)} / {featuredServices[0].durationMinutes} min
                </div>
              ) : null}
              <Button asChild>
                <Link href="/booking">Start booking</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}
