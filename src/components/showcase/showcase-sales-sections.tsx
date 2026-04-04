import Link from "next/link";
import {
  CalendarCheck2,
  Globe,
  LayoutDashboard,
  Mail,
  Palette,
  ShieldCheck,
  Sparkles,
  Check,
} from "lucide-react";

import { submitSalonLeadAction } from "@/app/(public)/for-salons/actions";
import { AdminInput, AdminTextarea } from "@/components/admin/admin-ui";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { showcaseComparisonRows, showcaseFaqs, showcaseFeatures, showcasePackages, showcaseSteps } from "@/config/showcase";
import { cn } from "@/lib/utils";

const featureIcons = {
  globe: Globe,
  calendar: CalendarCheck2,
  palette: Palette,
  mail: Mail,
  layout: LayoutDashboard,
  shield: ShieldCheck,
};

type ShowcaseDemoRequestSectionProps = {
  requestState?: string;
};

export function ShowcaseBenefitsSection() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Why salons buy"
          title="Package the product around clear owner value, not just features"
          description="The strongest sales story is simple: a professional branded website, direct bookings, less marketplace dependence, and a cleaner day-to-day operating flow for the owner."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {showcaseFeatures.map((feature) => {
            const Icon = featureIcons[feature.iconKey];

            return (
              <Card key={feature.title} className="h-full border-border/70 bg-card/85">
                <CardContent className="space-y-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/12 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm leading-7 text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export function ShowcaseHowItWorksSection() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="How it works"
          title="A straightforward delivery model for small salon owners"
          description="This keeps the offer easy to explain in a sales call: establish the brand direction, launch the site, then let the owner manage the essentials from the admin area."
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {showcaseSteps.map((step, index) => (
            <Card key={step.title} className="h-full overflow-hidden">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                    Step {index + 1}
                  </span>
                  <Sparkles className="h-5 w-5 text-primary/80" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{step.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function ShowcaseComparisonSection() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Positioning"
          title="A calmer alternative to commission-led dependence"
          description="The point is not to attack other platforms. It is to show salon owners the upside of owning more of their brand, customer journey, and booking experience."
        />

        <Card className="overflow-hidden">
          <div className="grid border-b border-border/70 bg-secondary/30 px-6 py-4 text-sm font-semibold text-foreground md:grid-cols-[0.7fr,1fr,1fr] md:px-8">
            <div>Area</div>
            <div className="hidden md:block">This platform</div>
            <div className="hidden md:block">Marketplace-led setup</div>
          </div>
          {showcaseComparisonRows.map((row) => (
            <div key={row.label} className="grid gap-4 border-b border-border/60 px-6 py-5 last:border-b-0 md:grid-cols-[0.7fr,1fr,1fr] md:px-8">
              <div>
                <p className="font-medium text-foreground">{row.label}</p>
              </div>
              <div className="rounded-3xl bg-primary/8 px-4 py-4 text-sm leading-7 text-muted-foreground">
                <p className="mb-2 font-medium text-foreground md:hidden">This platform</p>
                {row.ownerControlled}
              </div>
              <div className="rounded-3xl bg-secondary/35 px-4 py-4 text-sm leading-7 text-muted-foreground">
                <p className="mb-2 font-medium text-foreground md:hidden">Marketplace-led setup</p>
                {row.marketplaceLed}
              </div>
            </div>
          ))}
        </Card>
      </Container>
    </section>
  );
}

export function ShowcasePricingSection() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Packages"
          title="Present the offer in a way that feels sellable to salon owners"
          description="The numbers below are sample pricing for demo purposes, but the structure is intentionally realistic: an initial setup fee, a monthly service plan, and optional add-ons later."
        />

        <div className="grid gap-5 xl:grid-cols-4">
          {showcasePackages.map((pkg) => {
            const highlighted = pkg.name === "Pro plan";

            return (
              <Card key={pkg.name} className={cn("h-full", highlighted && "border-primary/30 bg-primary/5")}>
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardDescription>{pkg.cadence}</CardDescription>
                    {pkg.badge ? (
                      <span className="rounded-full bg-primary/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                        {pkg.badge}
                      </span>
                    ) : null}
                  </div>
                  <CardTitle className="text-3xl">{pkg.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <p className="text-4xl font-semibold tracking-tight text-foreground">{pkg.price}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{pkg.description}</p>
                  </div>
                  <div className="space-y-3 text-sm leading-6 text-muted-foreground">
                    {pkg.features.map((feature) => (
                      <div key={feature} className="flex gap-3">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export function ShowcaseFaqSection() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="FAQ"
          title="The practical questions salon owners usually ask"
          description="These answers help position the platform as a real service offer while keeping the scope honest about what is included today and what can be added later."
        />

        <div className="grid gap-4">
          {showcaseFaqs.map((faq) => (
            <Card key={faq.question}>
              <CardContent className="p-0">
                <details className="group px-6 py-5">
                  <summary className="cursor-pointer list-none text-lg font-semibold text-foreground marker:hidden">
                    {faq.question}
                  </summary>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
                    {faq.answer}
                  </p>
                </details>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function ShowcaseDemoRequestSection({ requestState }: ShowcaseDemoRequestSectionProps) {
  return (
    <section id="demo-request" className="pb-16 pt-16 sm:pb-20 sm:pt-20">
      <Container className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/12 via-background to-accent/20">
          <CardContent className="space-y-5 p-7 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Request a demo</p>
            <h2 className="font-heading text-4xl font-semibold tracking-tight text-foreground">
              Start the conversation with a salon-ready offer.
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Use this as a demo request CTA for salon owners who want a more professional online presence, direct bookings, and less dependency on third-party platforms.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                "Preview booking flow",
                "Preview admin controls",
                "Preview theme directions",
              ].map((item) => (
                <div key={item} className="rounded-3xl border border-border/70 bg-background/85 px-4 py-4 text-sm font-medium text-foreground">
                  {item}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/booking">Preview booking</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin">Preview admin</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Lightweight lead capture</CardDescription>
            <CardTitle>Request a tailored demo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {requestState === "sent" ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Thanks, your request has been saved and is ready for a follow-up conversation.
              </div>
            ) : null}
            {requestState === "error" ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                We could not save that request just now. Check the required fields and try again.
              </div>
            ) : null}

            <form action={submitSalonLeadAction} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-foreground">Your name</span>
                  <AdminInput name="name" placeholder="Amelia Carter" required />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-foreground">Salon name</span>
                  <AdminInput name="salon_name" placeholder="Atelier Nails" />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-foreground">Email</span>
                  <AdminInput name="email" type="email" placeholder="owner@ateliernails.co.uk" required />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-foreground">Current setup</span>
                  <AdminInput name="current_setup" placeholder="Instagram + booking marketplace" />
                </label>
              </div>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-foreground">What would you want the website to help with most?</span>
                <AdminTextarea
                  name="notes"
                  placeholder="For example: direct bookings, a more premium brand presence, easier service updates, or fewer third-party commissions."
                />
              </label>
              <Button type="submit" size="lg">
                Request demo walkthrough
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
