import Link from "next/link";
import { DateTime } from "luxon";
import { AlertCircle, CheckCircle2, Mail, Sparkles } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackPanel } from "@/components/ui/feedback-panel";
import { formatCurrency, formatDuration } from "@/lib/data/formatters";
import type { BookingConfirmationSummary } from "@/types/booking";
import type { NotificationStatus } from "@/types/salon";

type BookingSuccessSummaryProps = {
  summary: BookingConfirmationSummary | null;
  emailStatus?: NotificationStatus | null;
  emailMessage?: string | null;
};

export function BookingSuccessSummary({
  summary,
  emailStatus,
  emailMessage,
}: BookingSuccessSummaryProps) {
  if (!summary) {
    return (
      <section className="py-16 sm:py-20">
        <Container>
          <Card className="mx-auto max-w-3xl border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/18">
            <CardHeader className="text-center">
              <CardDescription>Booking confirmation</CardDescription>
              <CardTitle className="text-4xl">We could not load this confirmation summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-center">
              <FeedbackPanel variant="warning" title="The appointment may still have been created." icon={<AlertCircle className="h-4 w-4" />}>
                Open the booking flow again or contact the salon if you need to confirm the appointment manually.
              </FeedbackPanel>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <Link href="/booking">Back to booking</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/contact">Contact the studio</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>
    );
  }

  const formattedStart = DateTime.fromISO(summary.startsAt, { zone: "utc" })
    .setZone(summary.timezone)
    .toFormat("dd LLL yyyy 'at' HH:mm");

  const emailStatusPanel =
    emailStatus === "sent" ? (
      <FeedbackPanel variant="success" title="Confirmation email sent" icon={<Mail className="h-4 w-4" />}>
        A confirmation email has been sent to {summary.customerEmail ?? "the email provided"}.
      </FeedbackPanel>
    ) : emailStatus === "pending" ? (
      <FeedbackPanel variant="warning" title="Confirmation email still pending" icon={<Sparkles className="h-4 w-4" />}>
        The appointment is saved. The email attempt is still being processed and can be reviewed from the admin notifications log.
      </FeedbackPanel>
    ) : emailStatus === "failed" ? (
      <FeedbackPanel variant="warning" title="Your booking is confirmed, but the email could not be delivered." icon={<AlertCircle className="h-4 w-4" />}>
        {emailMessage ?? "The salon can still see the confirmed appointment in the admin area."}
      </FeedbackPanel>
    ) : null;

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <Card className="mx-auto max-w-4xl border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/18">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <CardDescription>Booking confirmation</CardDescription>
                <CardTitle className="text-4xl">Your appointment is confirmed</CardTitle>
              </div>
              <div className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                Booking saved
              </div>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              {summary.customerName}, your appointment with {summary.salonName} is now in the diary. Keep the details below for quick reference.
            </p>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
            <div className="space-y-4">
              {emailStatusPanel}
              <div className="rounded-2xl bg-background/85 p-4">
                <p className="font-medium text-foreground">Booking reference</p>
                <p className="text-sm text-muted-foreground">{summary.bookingId}</p>
              </div>
              <div className="rounded-2xl bg-background/85 p-4">
                <p className="font-medium text-foreground">When</p>
                <p className="text-sm text-muted-foreground">{formattedStart}</p>
              </div>
              <div className="rounded-2xl bg-background/85 p-4">
                <p className="font-medium text-foreground">Artist</p>
                <p className="text-sm text-muted-foreground">{summary.staffName ?? "Assigned by studio"}</p>
              </div>
              <div className="rounded-2xl bg-background/85 p-4">
                <p className="font-medium text-foreground">Contact used</p>
                <p className="text-sm text-muted-foreground">{summary.customerEmail ?? summary.customerPhone ?? "Saved with booking"}</p>
              </div>
              <FeedbackPanel title="Next steps" icon={<CheckCircle2 className="h-4 w-4 text-primary" />}>
                If you need to make changes, contact the salon directly and quote the booking reference above.
              </FeedbackPanel>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl bg-background/85 p-4">
                <p className="font-medium text-foreground">Service summary</p>
                <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                  {summary.lines.map((line) => (
                    <div
                      key={line.id}
                      className="flex items-center justify-between gap-4 rounded-xl border border-border/70 px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-foreground">{line.label}</p>
                        <p>{formatDuration(line.durationMinutes)}</p>
                      </div>
                      <p>{formatCurrency(line.priceCents, summary.currencyCode)}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-background/85 p-4">
                <p className="font-medium text-foreground">Total</p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  {formatCurrency(summary.totalPriceCents, summary.currencyCode)}
                </p>
              </div>
              {summary.notes ? (
                <div className="rounded-2xl bg-background/85 p-4">
                  <p className="font-medium text-foreground">Notes</p>
                  <p className="mt-2 text-sm text-muted-foreground">{summary.notes}</p>
                </div>
              ) : null}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild>
                  <Link href="/services">Browse services</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/contact">Contact the studio</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/booking">Book another visit</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
