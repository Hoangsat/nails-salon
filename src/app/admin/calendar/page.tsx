import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CalendarDayView } from "@/components/admin/calendar-day-view";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminField, AdminInput } from "@/components/admin/admin-ui";
import { BookingStatusBadge } from "@/components/admin/booking-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackPanel } from "@/components/ui/feedback-panel";
import { formatCurrency } from "@/lib/data/formatters";
import { getAdminCalendarData } from "@/lib/data/admin";

type CalendarPageProps = {
  searchParams?: {
    date?: string;
  };
};

export default async function AdminCalendarPage({ searchParams }: CalendarPageProps) {
  const data = await getAdminCalendarData(searchParams?.date);
  const hasScheduledEvents = data.columns.some((column) => column.events.length > 0) || data.unassignedEvents.length > 0;

  return (
    <AdminShell currentPath="/admin/calendar" isDemoMode={data.context.isDemoMode}>
      <AdminPageHeader
        eyebrow="Calendar"
        title="Daily schedule"
        description="A clear day-view schedule by artist, focused on visibility and operational confidence rather than drag-and-drop complexity."
      >
        <Button asChild variant="outline">
          <Link href="/admin/appointments">Open appointments list</Link>
        </Button>
      </AdminPageHeader>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">View date</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form method="get" className="flex flex-wrap items-end gap-4">
            <AdminField label="Calendar day">
              <AdminInput type="date" name="date" defaultValue={data.date} />
            </AdminField>
            <Button type="submit">Show day</Button>
          </form>
          {!hasScheduledEvents ? (
            <FeedbackPanel title="No bookings are scheduled for this day.">
              The calendar is still useful here as an availability check and a quick way to confirm the day is clear.
            </FeedbackPanel>
          ) : null}
        </CardContent>
      </Card>

      <CalendarDayView data={data} currencyCode={data.context.salon.currency_code} />

      {data.unassignedEvents.length ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Unassigned bookings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.unassignedEvents.map((event) => (
              <div key={event.bookingId} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
                <div>
                  <p className="font-medium text-foreground">{event.customerName}</p>
                  <p className="text-sm text-muted-foreground">{event.startsAt}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <BookingStatusBadge status={event.status} />
                  <p className="text-sm font-medium text-foreground">
                    {formatCurrency(event.totalPriceCents, data.context.salon.currency_code)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </AdminShell>
  );
}
