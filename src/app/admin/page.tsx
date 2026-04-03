import { DateTime } from "luxon";
import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminShell } from "@/components/admin/admin-shell";
import { BookingStatusBadge } from "@/components/admin/booking-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/data/formatters";
import { getAdminDashboardData } from "@/lib/data/admin";

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();
  const metrics = [
    {
      label: "Appointments today",
      value: data.metrics.appointmentsToday,
      detail: `For ${data.todayDate}`,
    },
    {
      label: "Upcoming appointments",
      value: data.metrics.upcomingAppointments,
      detail: "Confirmed and pending pipeline",
    },
    {
      label: "Active services",
      value: data.metrics.activeServicesCount,
      detail: "Bookable catalogue items",
    },
    {
      label: "Active staff",
      value: data.metrics.activeStaffCount,
      detail: "Artists available in roster",
    },
  ];

  return (
    <AdminShell currentPath="/admin" isDemoMode={data.context.isDemoMode}>
      <AdminPageHeader
        eyebrow="Admin Dashboard"
        title="Salon operations overview"
        description="A polished operating view for daily bookings, recent activity, and quick admin navigation with light Supabase-authenticated access in place."
        badge={data.context.salon.name}
      >
        <Button asChild variant="outline">
          <Link href="/admin/appointments">Manage appointments</Link>
        </Button>
      </AdminPageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader>
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-4xl">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{metric.detail}</CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr,0.75fr]">
        <Card>
          <CardHeader>
            <CardDescription>Recent bookings</CardDescription>
            <CardTitle>Latest appointment activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.recentBookings.map((item) => {
              const start = DateTime.fromISO(item.booking.starts_at, { zone: "utc" })
                .setZone(data.context.salon.timezone)
                .toFormat("dd LLL, HH:mm");

              return (
                <div
                  key={item.booking.id}
                  className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-background/70 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-medium text-foreground">{item.customerName}</p>
                      <BookingStatusBadge status={item.booking.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.staffName ?? "Unassigned"} · {start}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm font-medium text-foreground">
                      {formatCurrency(item.booking.total_price_cents, data.context.salon.currency_code)}
                    </p>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/appointments?selected=${item.booking.id}`}>View booking</Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="bg-secondary/30">
          <CardHeader>
            <CardDescription>Operations notes</CardDescription>
            <CardTitle>What this admin phase covers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>Appointments, services, staff, salon details, theme controls, and notifications are manageable from this admin surface.</p>
            <p>Access is now protected by a light Supabase Auth sign-in flow while deeper roles, permissions, and analytics remain intentionally out of scope.</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="sm">
                <Link href="/admin/calendar">Open calendar</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/admin/theme">Edit theme</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}

