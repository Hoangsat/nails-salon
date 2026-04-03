import { PageIntro } from "@/components/sections/page-intro";
import { BookingSuccessSummary } from "@/components/booking/booking-success-summary";
import { getBookingConfirmationSummary } from "@/lib/data/booking";
import type { NotificationStatus } from "@/types/salon";

type BookingSuccessPageProps = {
  searchParams?: {
    bookingId?: string;
    emailStatus?: NotificationStatus;
    emailMessage?: string;
  };
};

export default async function BookingSuccessPage({ searchParams }: BookingSuccessPageProps) {
  const bookingId = searchParams?.bookingId ?? "";
  const summary = bookingId ? await getBookingConfirmationSummary(bookingId) : null;

  return (
    <>
      <PageIntro
        eyebrow="Booking Success"
        title="Your appointment details"
        description="Review the saved appointment, see whether the confirmation email was sent successfully, and use the booking reference for any follow-up with the salon."
      />
      <BookingSuccessSummary
        summary={summary}
        emailStatus={searchParams?.emailStatus ?? null}
        emailMessage={searchParams?.emailMessage ?? null}
      />
    </>
  );
}
