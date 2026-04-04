import { CheckCircle2, HeartHandshake, Shield, Sparkle } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

const trustPoints = [
  {
    icon: Shield,
    title: "Hygiene-first standards",
    description:
      "Clear prep routines, tool hygiene, and finish consistency are positioned as part of the premium experience, not an afterthought.",
  },
  {
    icon: Sparkle,
    title: "Editorial-level finish",
    description:
      "Soft neutrals, clean shapes, and detail-focused polish help the studio feel current, elevated, and portfolio-ready.",
  },
  {
    icon: HeartHandshake,
    title: "Client comfort in focus",
    description:
      "The public journey emphasizes calm pacing, thoughtful care, and a luxury-service tone from discovery through booking.",
  },
  {
    icon: CheckCircle2,
    title: "Structured service clarity",
    description:
      "Category grouping, timing, pricing, and add-ons are all presented clearly so the offer feels trustworthy and easy to understand.",
  },
] as const;

export function WhyChooseUsSection() {
  return (
    <section className="border-y border-border/60 bg-secondary/20 py-16 sm:py-20">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Built around the standards guests look for in a premium salon"
          description="This reusable section gives the site a stronger point of view around quality, experience, hygiene, and finish without depending on more complex booking or admin workflows."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {trustPoints.map((point) => {
            const Icon = point.icon;
            return (
              <Card key={point.title} className="h-full bg-background/85">
                <CardHeader className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl">{point.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-7 text-muted-foreground">{point.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
