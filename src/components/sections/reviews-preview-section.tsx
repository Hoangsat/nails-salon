import { Star } from "lucide-react";

import { Container } from "@/components/layout/container";
import { formatReviewLabel } from "@/lib/data/formatters";
import type { Review } from "@/types/salon";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

type ReviewsPreviewSectionProps = {
  reviews: Review[];
};

export function ReviewsPreviewSection({ reviews }: ReviewsPreviewSectionProps) {
  return (
    <section className="py-16 sm:py-20">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Client Reviews"
          title="Social proof that helps the demo feel established"
          description="Review cards now pull from the structured review dataset and are styled to read more like a premium salon recommendation wall than temporary placeholders."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {reviews.map((review) => (
            <Card key={review.id} className="h-full">
              <CardHeader className="space-y-4">
                <div className="flex items-center gap-1 text-primary">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star key={`${review.id}-${index}`} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <CardDescription>
                  {formatReviewLabel(review.rating, review.sourceLabel)}
                </CardDescription>
                <CardTitle>{review.authorName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-7 text-muted-foreground">&ldquo;{review.reviewText}&rdquo;</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
