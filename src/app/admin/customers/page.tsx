import { DateTime } from "luxon";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackPanel } from "@/components/ui/feedback-panel";
import { getAdminCustomersData } from "@/lib/data/admin";

export default async function AdminCustomersPage() {
  const data = await getAdminCustomersData();

  return (
    <AdminShell currentPath="/admin/customers" isDemoMode={data.context.isDemoMode}>
      <AdminPageHeader
        eyebrow="Customers"
        title="Customer list"
        description="A read-only customer directory for this phase, showing core contact details, internal notes, and lightweight booking history context."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Customers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.customers.length ? (
            data.customers.map((item) => (
              <div key={item.customer.id} className="grid gap-4 rounded-2xl border border-border/70 bg-background/70 p-4 lg:grid-cols-[1.1fr,0.9fr,0.7fr,0.8fr] lg:items-start">
                <div>
                  <p className="font-medium text-foreground">{item.fullName}</p>
                  <p className="text-sm text-muted-foreground">{item.customer.email ?? "No email"}</p>
                  <p className="text-sm text-muted-foreground">{item.customer.phone ?? "No phone"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Notes</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.customer.notes ?? "No internal notes saved."}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Bookings</p>
                  <p className="mt-2 text-sm font-medium text-foreground">{item.bookingCount}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Latest booking</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.latestBookingDate
                      ? DateTime.fromISO(item.latestBookingDate).toFormat("dd LLL yyyy")
                      : "No bookings yet"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <FeedbackPanel title="No customers have been captured yet.">
              New bookings will automatically create or match customer records as the salon starts taking appointments.
            </FeedbackPanel>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
