import { DateTime } from "luxon";

import {
  deleteBlackoutDate,
  updateSalonSettings,
  upsertBlackoutDate,
  upsertWorkingHours,
} from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminShell } from "@/components/admin/admin-shell";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { AdminSubmitButton } from "@/components/admin/admin-submit-button";
import { AdminCheckboxRow, AdminField, AdminInput, AdminSelect, AdminTextarea } from "@/components/admin/admin-ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackPanel } from "@/components/ui/feedback-panel";
import { getAdminSettingsData } from "@/lib/data/admin";
import { getDayLabel } from "@/lib/data/formatters";

export default async function AdminSettingsPage() {
  const data = await getAdminSettingsData();

  return (
    <AdminShell currentPath="/admin/settings" isDemoMode={data.context.isDemoMode}>
      <AdminPageHeader
        eyebrow="Settings"
        title="Salon settings"
        description="Edit core salon details, keep public contact information in sync, and manage salon-level working hours plus blackout periods from one operational page."
      />

      <Card>
        <CardHeader>
          <CardDescription>Salon profile</CardDescription>
          <CardTitle className="text-2xl">Business details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateSalonSettings} className="grid gap-4 md:grid-cols-2">
            <input type="hidden" name="salon_id" value={data.context.salon.id} />
            <AdminField label="Salon name">
              <AdminInput name="name" defaultValue={data.context.salon.name} required />
            </AdminField>
            <AdminField label="Tagline">
              <AdminInput name="tagline" defaultValue={data.context.salon.tagline ?? ""} />
            </AdminField>
            <AdminField label="Phone">
              <AdminInput name="phone" defaultValue={data.context.salon.phone ?? ""} />
            </AdminField>
            <AdminField label="Email">
              <AdminInput type="email" name="email" defaultValue={data.context.salon.email ?? ""} />
            </AdminField>
            <AdminField label="Address line 1" className="md:col-span-2">
              <AdminInput name="address_line_1" defaultValue={data.context.salon.address_line_1 ?? ""} />
            </AdminField>
            <AdminField label="Address line 2" className="md:col-span-2">
              <AdminInput name="address_line_2" defaultValue={data.context.salon.address_line_2 ?? ""} />
            </AdminField>
            <AdminField label="City">
              <AdminInput name="city" defaultValue={data.context.salon.city ?? ""} />
            </AdminField>
            <AdminField label="Region">
              <AdminInput name="region" defaultValue={data.context.salon.region ?? ""} />
            </AdminField>
            <AdminField label="Postal code">
              <AdminInput name="postal_code" defaultValue={data.context.salon.postal_code ?? ""} />
            </AdminField>
            <AdminField label="Country code">
              <AdminInput name="country_code" defaultValue={data.context.salon.country_code} />
            </AdminField>
            <AdminField label="Timezone">
              <AdminInput name="timezone" defaultValue={data.context.salon.timezone} />
            </AdminField>
            <AdminField label="Currency code">
              <AdminInput name="currency_code" defaultValue={data.context.salon.currency_code} />
            </AdminField>
            <AdminField label="Website URL" className="md:col-span-2">
              <AdminInput name="website_url" defaultValue={data.context.salon.website_url ?? ""} />
            </AdminField>
            <AdminField label="Facebook URL" className="md:col-span-2">
              <AdminInput name="facebook_url" defaultValue={data.context.salon.facebook_url ?? ""} />
            </AdminField>
            <AdminField label="Instagram URL" className="md:col-span-2">
              <AdminInput name="instagram_url" defaultValue={data.context.salon.instagram_url ?? ""} />
            </AdminField>
            <AdminField label="Description" className="md:col-span-2">
              <AdminTextarea name="description" defaultValue={data.context.salon.description ?? ""} />
            </AdminField>
            <AdminField label="Booking notice" className="md:col-span-2" hint="Shown on the public booking and contact experience.">
              <AdminTextarea name="booking_notice" defaultValue={data.context.salon.booking_notice ?? ""} />
            </AdminField>
            <AdminSubmitButton label="Save salon settings" pendingLabel="Saving..." className="md:col-span-2 md:w-fit" />
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Salon-level hours</CardDescription>
          <CardTitle className="text-2xl">Working hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FeedbackPanel title="Hours shown here drive public availability and contact-page opening times.">
            Use closed days or blackout periods below when the salon should not accept bookings.
          </FeedbackPanel>

          {data.workingHours.map((row) => (
            <form key={row.id} action={upsertWorkingHours} className="grid gap-4 rounded-2xl border border-border/70 bg-background/70 p-4 md:grid-cols-[1fr,1fr,1fr,auto] md:items-end">
              <input type="hidden" name="working_hours_id" value={row.id} />
              <input type="hidden" name="salon_id" value={data.context.salon.id} />
              <input type="hidden" name="day_of_week" value={row.day_of_week} />
              <input type="hidden" name="sort_order" value={row.sort_order} />
              <div>
                <p className="text-sm font-medium text-foreground">{getDayLabel(row.day_of_week)}</p>
                <p className="text-xs text-muted-foreground">Salon-level availability</p>
              </div>
              <AdminField label="Opens">
                <AdminInput type="time" name="opens_at" defaultValue={row.opens_at?.slice(0, 5) ?? ""} />
              </AdminField>
              <AdminField label="Closes">
                <AdminInput type="time" name="closes_at" defaultValue={row.closes_at?.slice(0, 5) ?? ""} />
              </AdminField>
              <div className="flex flex-wrap items-center gap-3">
                <div className="min-w-[150px]">
                  <AdminCheckboxRow label="Closed" inputProps={{ name: "is_closed", defaultChecked: row.is_closed }} />
                </div>
                <AdminSubmitButton label="Save" pendingLabel="Saving..." variant="outline" size="sm" />
              </div>
            </form>
          ))}

          <form action={upsertWorkingHours} className="grid gap-4 rounded-2xl border border-dashed border-border/70 bg-background/60 p-4 md:grid-cols-[1fr,1fr,1fr,auto] md:items-end">
            <input type="hidden" name="salon_id" value={data.context.salon.id} />
            <AdminField label="Day">
              <AdminSelect name="day_of_week" defaultValue="0">
                {Array.from({ length: 7 }, (_, index) => (
                  <option key={index} value={index}>{getDayLabel(index)}</option>
                ))}
              </AdminSelect>
            </AdminField>
            <AdminField label="Opens">
              <AdminInput type="time" name="opens_at" defaultValue="10:00" />
            </AdminField>
            <AdminField label="Closes">
              <AdminInput type="time" name="closes_at" defaultValue="19:00" />
            </AdminField>
            <div className="grid gap-3">
              <AdminInput type="hidden" name="sort_order" defaultValue="7" />
              <AdminCheckboxRow label="Closed" inputProps={{ name: "is_closed" }} />
              <AdminSubmitButton label="Add row" pendingLabel="Adding..." variant="outline" size="sm" />
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Closures and time blocks</CardDescription>
          <CardTitle className="text-2xl">Blackout dates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.blackoutDates.length ? data.blackoutDates.map((row) => {
            const startsLocal = DateTime.fromISO(row.starts_at, { zone: "utc" }).setZone(data.context.salon.timezone).toFormat("yyyy-LL-dd'T'HH:mm");
            const endsLocal = DateTime.fromISO(row.ends_at, { zone: "utc" }).setZone(data.context.salon.timezone).toFormat("yyyy-LL-dd'T'HH:mm");

            return (
              <div key={row.id} className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <form action={upsertBlackoutDate} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <input type="hidden" name="blackout_id" value={row.id} />
                  <input type="hidden" name="salon_id" value={data.context.salon.id} />
                  <AdminField label="Staff scope">
                    <AdminSelect name="staff_id" defaultValue={row.staff_id ?? ""}>
                      <option value="">Entire salon</option>
                      {data.staff.map((member) => (
                        <option key={member.id} value={member.id}>{member.display_name}</option>
                      ))}
                    </AdminSelect>
                  </AdminField>
                  <AdminField label="Starts">
                    <AdminInput type="datetime-local" name="starts_at_local" defaultValue={startsLocal} />
                  </AdminField>
                  <AdminField label="Ends">
                    <AdminInput type="datetime-local" name="ends_at_local" defaultValue={endsLocal} />
                  </AdminField>
                  <AdminField label="Reason">
                    <AdminInput name="reason" defaultValue={row.reason ?? ""} />
                  </AdminField>
                  <div className="flex flex-wrap gap-3 md:col-span-2 xl:col-span-4">
                    <AdminSubmitButton label="Save blackout" pendingLabel="Saving..." />
                  </div>
                </form>
                <form action={deleteBlackoutDate} className="mt-3">
                  <input type="hidden" name="blackout_id" value={row.id} />
                  <ConfirmSubmitButton
                    label="Delete blackout"
                    pendingLabel="Deleting..."
                    confirmMessage={`Delete blackout${row.reason ? `: ${row.reason}` : ""}?`}
                  />
                </form>
              </div>
            );
          }) : (
            <FeedbackPanel title="No blackout periods are currently saved.">
              Add blackout windows for salon-wide closures, holidays, or team-specific time blocks.
            </FeedbackPanel>
          )}

          <form action={upsertBlackoutDate} className="grid gap-4 rounded-2xl border border-dashed border-border/70 bg-background/60 p-4 md:grid-cols-2 xl:grid-cols-4">
            <input type="hidden" name="salon_id" value={data.context.salon.id} />
            <AdminField label="Staff scope">
              <AdminSelect name="staff_id" defaultValue="">
                <option value="">Entire salon</option>
                {data.staff.map((member) => (
                  <option key={member.id} value={member.id}>{member.display_name}</option>
                ))}
              </AdminSelect>
            </AdminField>
            <AdminField label="Starts">
              <AdminInput type="datetime-local" name="starts_at_local" />
            </AdminField>
            <AdminField label="Ends">
              <AdminInput type="datetime-local" name="ends_at_local" />
            </AdminField>
            <AdminField label="Reason">
              <AdminInput name="reason" placeholder="Holiday closure" />
            </AdminField>
            <AdminSubmitButton label="Add blackout" pendingLabel="Adding..." className="md:col-span-2 xl:col-span-4 xl:w-fit" />
          </form>
        </CardContent>
      </Card>
    </AdminShell>
  );
}

