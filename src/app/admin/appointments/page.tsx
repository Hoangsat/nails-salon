import { DateTime } from "luxon";
import Link from "next/link";

import { updateBookingStatus } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminSubmitButton } from "@/components/admin/admin-submit-button";
import { BookingStatusBadge } from "@/components/admin/booking-status-badge";
import { AdminField, AdminInput, AdminSelect } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackPanel } from "@/components/ui/feedback-panel";
import { formatCurrency, formatDuration } from "@/lib/data/formatters";
import { getAdminAppointmentsData } from "@/lib/data/admin";

type AppointmentsPageProps = {
  searchParams?: {
    date?: string;
    status?: string;
    selected?: string;
  };
};

export default async function AdminAppointmentsPage({ searchParams }: AppointmentsPageProps) {
  const data = await getAdminAppointmentsData({
    date: searchParams?.date,
    status: searchParams?.status,
    selectedBookingId: searchParams?.selected,
  });
  const hasActiveFilters = Boolean(data.statusFilter);

  function buildDetailsHref(bookingId: string) {
    const params = new URLSearchParams();
    params.set("date", data.dateFilter);
    if (data.statusFilter) {
      params.set("status", data.statusFilter);
    }
    params.set("selected", bookingId);
    return `/admin/appointments?${params.toString()}`;
  }

  return (
    <AdminShell currentPath="/admin/appointments" isDemoMode={data.context.isDemoMode}>
      <AdminPageHeader
        eyebrow="Appointments"
        title="Booking management"
        description="Filter appointments by date and status, update booking state, and inspect service-line snapshots without touching payments or notification delivery."
      >
        <Button asChild variant="outline">
          <Link href="/admin/calendar">View calendar</Link>
        </Button>
      </AdminPageHeader>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="grid gap-4 md:grid-cols-[1fr,1fr,auto]" method="get">
            <AdminField label="Date" hint="Defaults to the current salon date.">
              <AdminInput type="date" name="date" defaultValue={data.dateFilter} />
            </AdminField>
            <AdminField label="Status">
              <AdminSelect name="status" defaultValue={data.statusFilter || "all"}>
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
                <option value="no_show">No show</option>
              </AdminSelect>
            </AdminField>
            <div className="flex items-end gap-3">
              <Button type="submit" className="w-full md:w-auto">Apply filters</Button>
              {hasActiveFilters ? (
                <Button asChild type="button" variant="outline" className="w-full md:w-auto">
                  <Link href={`/admin/appointments?date=${data.dateFilter}`}>Clear status</Link>
                </Button>
              ) : null}
            </div>
          </form>
          <FeedbackPanel title="Current view">
            Showing {data.appointments.length} appointment{data.appointments.length === 1 ? "" : "s"} for {data.dateFilter}
            {data.statusFilter ? ` with status filtered to ${data.statusFilter.replace("_", " ")}.` : "."}
          </FeedbackPanel>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Appointments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.appointments.length ? (
              data.appointments.map((item) => {
                const startLabel = DateTime.fromISO(item.booking.starts_at, { zone: "utc" })
                  .setZone(data.context.salon.timezone)
                  .toFormat("dd LLL · HH:mm");

                return (
                  <div
                    key={item.booking.id}
                    className="rounded-2xl border border-border/70 bg-background/70 p-4"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="font-medium text-foreground">{item.customerName}</p>
                          <BookingStatusBadge status={item.booking.status} />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.staffName ?? "Unassigned"} · {startLabel}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.customerEmail ?? item.customerPhone ?? "No contact details captured"}
                        </p>
                      </div>
                      <div className="flex flex-col gap-3 lg:min-w-[260px] lg:items-end">
                        <p className="text-sm font-medium text-foreground">
                          {formatCurrency(item.booking.total_price_cents, data.context.salon.currency_code)}
                        </p>
                        <Button asChild size="sm" variant="outline">
                          <Link href={buildDetailsHref(item.booking.id)}>View details</Link>
                        </Button>
                        <form action={updateBookingStatus} className="flex w-full flex-wrap gap-2 lg:justify-end">
                          <input type="hidden" name="booking_id" value={item.booking.id} />
                          <AdminSelect name="status" defaultValue={item.booking.status} className="min-w-[150px] lg:max-w-[170px]">
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                            <option value="no_show">No show</option>
                          </AdminSelect>
                          <AdminSubmitButton label="Save status" pendingLabel="Saving..." variant="outline" size="sm" />
                        </form>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <FeedbackPanel title="No appointments matched the current filters.">
                Try a different date or remove the status filter to widen the view.
              </FeedbackPanel>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Booking details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            {data.selectedAppointment ? (
              <>
                <div className="rounded-2xl bg-secondary/35 p-4">
                  <p className="font-medium text-foreground">Guest</p>
                  <p>{data.selectedAppointment.customerName}</p>
                  <p>{data.selectedAppointment.customerEmail ?? data.selectedAppointment.customerPhone ?? "No contact details"}</p>
                </div>
                <div className="rounded-2xl bg-secondary/35 p-4">
                  <p className="font-medium text-foreground">Appointment</p>
                  <p>{DateTime.fromISO(data.selectedAppointment.booking.starts_at, { zone: "utc" }).setZone(data.context.salon.timezone).toFormat("cccc dd LLL yyyy, HH:mm")}</p>
                  <p>{data.selectedAppointment.staffName ?? "Unassigned"}</p>
                </div>
                <div className="rounded-2xl bg-secondary/35 p-4">
                  <p className="font-medium text-foreground">Booked services</p>
                  <div className="mt-3 space-y-3">
                    {data.selectedAppointment.lines.map((line) => (
                      <div key={line.id} className="flex items-center justify-between gap-4 rounded-xl border border-border/70 px-4 py-3">
                        <div>
                          <p className="font-medium text-foreground">{line.line_label}</p>
                          <p>{formatDuration(line.duration_minutes)}</p>
                        </div>
                        <p>{formatCurrency(line.price_cents, data.context.salon.currency_code)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {data.selectedAppointment.booking.notes ? (
                  <div className="rounded-2xl bg-secondary/35 p-4">
                    <p className="font-medium text-foreground">Client notes</p>
                    <p>{data.selectedAppointment.booking.notes}</p>
                  </div>
                ) : null}
              </>
            ) : (
              <FeedbackPanel title="Choose an appointment to inspect the saved booking snapshot.">
                This panel shows the guest details, booked line items, and notes for the selected appointment.
              </FeedbackPanel>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
