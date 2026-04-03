import { DateTime } from "luxon";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackPanel } from "@/components/ui/feedback-panel";
import { getAdminNotificationsData } from "@/lib/data/admin";

const statusStyles: Record<string, string> = {
  sent: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  failed: "border-rose-200 bg-rose-50 text-rose-700",
};

export default async function AdminNotificationsPage() {
  const data = await getAdminNotificationsData();
  const statusCounts = {
    sent: data.notifications.filter((item) => item.notification.status === "sent").length,
    pending: data.notifications.filter((item) => item.notification.status === "pending").length,
    failed: data.notifications.filter((item) => item.notification.status === "failed").length,
  };

  return (
    <AdminShell currentPath="/admin/notifications" isDemoMode={data.context.isDemoMode}>
      <AdminPageHeader
        eyebrow="Notifications"
        title="Notifications log"
        description="A read-only audit view of attempted booking emails. Pending, sent, and failed outcomes are surfaced here so the salon can follow up manually if needed."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Sent", value: statusCounts.sent },
          { label: "Pending", value: statusCounts.pending },
          { label: "Failed", value: statusCounts.failed },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Logged notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.notifications.length ? (
            data.notifications.map((item) => (
              <div key={item.notification.id} className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <div className="grid gap-4 lg:grid-cols-[1fr,1fr,0.9fr,0.9fr]">
                  <div>
                    <p className="font-medium text-foreground">{item.notification.template_key ?? item.notification.notification_type}</p>
                    <p className="text-sm text-muted-foreground">{item.notification.channel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Recipient</p>
                    <p className="font-medium text-foreground">{item.notification.recipient ?? "No recipient"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Related booking</p>
                    <p className="font-medium text-foreground">{item.bookingLabel ?? "No booking linked"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[item.notification.status] ?? "border-border bg-secondary text-secondary-foreground"}`}>
                      {item.notification.status}
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 text-sm lg:grid-cols-[1fr,1fr]">
                  <div>
                    <p className="text-muted-foreground">Logged</p>
                    <p className="font-medium text-foreground">
                      {DateTime.fromISO(item.notification.created_at, { zone: "utc" })
                        .setZone(data.context.salon.timezone)
                        .toFormat("dd LLL yyyy, HH:mm")}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Sent at</p>
                    <p className="font-medium text-foreground">
                      {item.notification.sent_at
                        ? DateTime.fromISO(item.notification.sent_at, { zone: "utc" })
                            .setZone(data.context.salon.timezone)
                            .toFormat("dd LLL yyyy, HH:mm")
                        : "Not sent"}
                    </p>
                  </div>
                </div>
                {item.notification.error_message ? (
                  <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {item.notification.error_message}
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <FeedbackPanel title="No notifications have been logged yet.">
              New booking confirmations will appear here once emails are attempted.
            </FeedbackPanel>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
