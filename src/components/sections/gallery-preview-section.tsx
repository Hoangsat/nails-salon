import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import type { GalleryImage } from "@/types/salon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

type GalleryPreviewSectionProps = {
  items: GalleryImage[];
};

export function GalleryPreviewSection({ items }: GalleryPreviewSectionProps) {
  return (
    <section className="border-y border-border/60 bg-secondary/20 py-16 sm:py-20">
      <Container className="space-y-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Portfolio Preview"
            title="A gallery presentation that feels closer to a real salon portfolio"
            description="The preview now uses actual demo imagery from the structured gallery layer, with category labels and stronger visual treatment for a more credible sales experience."
          />
          <Button asChild variant="outline">
            <Link href="/gallery">See the full gallery</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-[1.15fr,0.85fr]">
          {items.map((item, index) => (
            <Card
              key={item.id}
              className={index === 0 ? "overflow-hidden xl:row-span-2" : "overflow-hidden"}
            >
              <div className={`relative ${index === 0 ? "aspect-[5/6]" : "aspect-[16/11]"}`}>
                <Image
                  src={item.imageUrl}
                  alt={item.altText ?? item.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" />
              </div>
              <CardHeader>
                <CardDescription>{item.category ?? "Portfolio"}</CardDescription>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-7 text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
