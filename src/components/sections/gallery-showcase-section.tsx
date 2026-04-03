import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

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
          title="A gallery layout that feels closer to a real nail portfolio feed"
          description="The gallery is still powered by structured image data, but the presentation now leans into a more scrollable, social-first showcase that is ready to swap in real client work photography."
        />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {items.map((item, index) => (
            <Card
              key={item.id}
              className={`${index === 0 ? "col-span-2 md:col-span-2 md:row-span-2" : ""} overflow-hidden border-border/60 bg-card/95`}
            >
              <div className={`relative ${index === 0 ? "aspect-[4/5]" : "aspect-square"}`}>
                <Image
                  src={item.imageUrl}
                  alt={item.altText ?? item.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 via-foreground/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-background sm:p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-background/80 sm:text-xs">
                    {item.category ?? "Portfolio image"}
                  </p>
                  <h3 className="mt-2 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                    {item.title}
                  </h3>
                  {item.description ? (
                    <p className="mt-2 max-w-md text-sm leading-6 text-background/85">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[calc(var(--radius)+0.1rem)] border border-border/70 bg-secondary/25 px-5 py-4 text-sm text-muted-foreground">
          <p>
            This grid is ready for real work photos, close-up nail details, and campaign content without changing the gallery structure.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/booking">Book from the portfolio</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
