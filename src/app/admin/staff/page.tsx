import { deleteStaff, upsertStaff } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminShell } from "@/components/admin/admin-shell";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { AdminSubmitButton } from "@/components/admin/admin-submit-button";
import { AdminCheckboxRow, AdminField, AdminInput, AdminTextarea } from "@/components/admin/admin-ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackPanel } from "@/components/ui/feedback-panel";
import { getAdminStaffData } from "@/lib/data/admin";

export default async function AdminStaffPage() {
  const data = await getAdminStaffData();
  const serviceIds = data.services.map((service) => service.id).join(",");

  return (
    <AdminShell currentPath="/admin/staff" isDemoMode={data.context.isDemoMode}>
      <AdminPageHeader
        eyebrow="Staff"
        title="Team roster"
        description="Maintain staff profiles, active status, featured flags, and the service assignments that drive booking availability and staff-specific overrides."
      />

      <Card>
        <CardHeader>
          <CardDescription>Create a new team member</CardDescription>
          <CardTitle className="text-2xl">Add staff member</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={upsertStaff} className="grid gap-4 md:grid-cols-2">
            <input type="hidden" name="salon_id" value={data.context.salon.id} />
            <input type="hidden" name="service_ids" value={serviceIds} />
            <AdminField label="First name">
              <AdminInput name="first_name" required />
            </AdminField>
            <AdminField label="Last name">
              <AdminInput name="last_name" required />
            </AdminField>
            <AdminField label="Display name" hint="Optional public name shown in booking and public pages.">
              <AdminInput name="display_name" placeholder="Optional public display name" />
            </AdminField>
            <AdminField label="Role">
              <AdminInput name="role" placeholder="Builder Gel Specialist" required />
            </AdminField>
            <AdminField label="Email">
              <AdminInput name="email" type="email" />
            </AdminField>
            <AdminField label="Phone">
              <AdminInput name="phone" />
            </AdminField>
            <AdminField label="Instagram handle">
              <AdminInput name="instagram_handle" placeholder="@artist.handle" />
            </AdminField>
            <AdminField label="Sort order">
              <AdminInput type="number" name="sort_order" defaultValue="0" />
            </AdminField>
            <AdminField label="Profile image URL" className="md:col-span-2">
              <AdminInput name="profile_image_url" placeholder="https://... or /images/..." />
            </AdminField>
            <AdminField label="Bio" className="md:col-span-2">
              <AdminTextarea name="bio" />
            </AdminField>
            <div className="grid gap-3 md:col-span-2 md:grid-cols-2">
              <AdminCheckboxRow label="Active staff member" inputProps={{ name: "is_active", defaultChecked: true }} />
              <AdminCheckboxRow label="Featured on public pages" inputProps={{ name: "is_featured" }} />
            </div>
            <div className="space-y-4 rounded-3xl border border-border/70 bg-secondary/25 p-4 md:col-span-2">
              <div>
                <p className="font-medium text-foreground">Service assignments</p>
                <p className="text-sm text-muted-foreground">Check the services this team member can perform. Override fields are optional.</p>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {data.services.map((service) => (
                  <div key={service.id} className="rounded-2xl border border-border/70 bg-background/80 p-4">
                    <AdminCheckboxRow label={service.name} description={service.category} inputProps={{ name: `assign_${service.id}` }} />
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <AdminField label="Custom duration">
                        <AdminInput type="number" name={`duration_${service.id}`} min="0" placeholder="Use service default" />
                      </AdminField>
                      <AdminField label="Custom price">
                        <AdminInput type="number" name={`price_${service.id}`} min="0" placeholder="Use service default" />
                      </AdminField>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <AdminSubmitButton label="Create staff member" pendingLabel="Creating..." className="md:col-span-2 md:w-fit" />
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {data.staff.length ? (
          data.staff.map((record) => {
            const assignmentsMap = new Map(record.assignments.map((assignment) => [assignment.serviceId, assignment]));

            return (
              <Card key={record.staff.id}>
                <CardHeader>
                  <CardDescription>
                    {record.staff.role} · {record.assignments.length} service assignments
                  </CardDescription>
                  <CardTitle className="text-2xl">{record.staff.display_name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form action={upsertStaff} className="grid gap-4 md:grid-cols-2">
                    <input type="hidden" name="staff_id" value={record.staff.id} />
                    <input type="hidden" name="salon_id" value={data.context.salon.id} />
                    <input type="hidden" name="service_ids" value={serviceIds} />
                    <AdminField label="First name">
                      <AdminInput name="first_name" defaultValue={record.staff.first_name} required />
                    </AdminField>
                    <AdminField label="Last name">
                      <AdminInput name="last_name" defaultValue={record.staff.last_name} required />
                    </AdminField>
                    <AdminField label="Display name">
                      <AdminInput name="display_name" defaultValue={record.staff.display_name} />
                    </AdminField>
                    <AdminField label="Role">
                      <AdminInput name="role" defaultValue={record.staff.role} required />
                    </AdminField>
                    <AdminField label="Email">
                      <AdminInput name="email" type="email" defaultValue={record.staff.email ?? ""} />
                    </AdminField>
                    <AdminField label="Phone">
                      <AdminInput name="phone" defaultValue={record.staff.phone ?? ""} />
                    </AdminField>
                    <AdminField label="Instagram handle">
                      <AdminInput name="instagram_handle" defaultValue={record.staff.instagram_handle ?? ""} />
                    </AdminField>
                    <AdminField label="Sort order">
                      <AdminInput type="number" name="sort_order" defaultValue={record.staff.sort_order} />
                    </AdminField>
                    <AdminField label="Profile image URL" className="md:col-span-2">
                      <AdminInput name="profile_image_url" defaultValue={record.staff.profile_image_url ?? ""} />
                    </AdminField>
                    <AdminField label="Bio" className="md:col-span-2">
                      <AdminTextarea name="bio" defaultValue={record.staff.bio ?? ""} />
                    </AdminField>
                    <div className="grid gap-3 md:col-span-2 md:grid-cols-2">
                      <AdminCheckboxRow label="Active staff member" inputProps={{ name: "is_active", defaultChecked: record.staff.is_active }} />
                      <AdminCheckboxRow label="Featured on public pages" inputProps={{ name: "is_featured", defaultChecked: record.staff.is_featured }} />
                    </div>
                    <div className="space-y-4 rounded-3xl border border-border/70 bg-secondary/25 p-4 md:col-span-2">
                      <div>
                        <p className="font-medium text-foreground">Service assignments</p>
                        <p className="text-sm text-muted-foreground">Update the services this team member can perform and optionally override timing or price.</p>
                      </div>
                      <div className="grid gap-4 lg:grid-cols-2">
                        {data.services.map((service) => {
                          const assignment = assignmentsMap.get(service.id);
                          return (
                            <div key={`${record.staff.id}-${service.id}`} className="rounded-2xl border border-border/70 bg-background/80 p-4">
                              <AdminCheckboxRow
                                label={service.name}
                                description={service.category}
                                inputProps={{ name: `assign_${service.id}`, defaultChecked: !!assignment }}
                              />
                              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                <AdminField label="Custom duration">
                                  <AdminInput type="number" name={`duration_${service.id}`} min="0" defaultValue={assignment?.customDurationMinutes ?? ""} placeholder="Use service default" />
                                </AdminField>
                                <AdminField label="Custom price">
                                  <AdminInput type="number" name={`price_${service.id}`} min="0" defaultValue={assignment?.customPriceCents ?? ""} placeholder="Use service default" />
                                </AdminField>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <AdminSubmitButton label="Save staff member" pendingLabel="Saving..." className="md:col-span-2 md:w-fit" />
                  </form>

                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-rose-200 bg-rose-50/70 px-4 py-4">
                    <div className="text-sm leading-6 text-rose-800">
                      <p className="font-medium text-foreground">Delete this staff profile</p>
                      <p>Delete only if the artist should no longer exist in the admin or booking flow.</p>
                    </div>
                    <form action={deleteStaff}>
                      <input type="hidden" name="staff_id" value={record.staff.id} />
                      <ConfirmSubmitButton
                        label="Delete staff member"
                        pendingLabel="Deleting..."
                        confirmMessage={`Delete ${record.staff.display_name}? This cannot be undone from the demo UI.`}
                      />
                    </form>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="p-6">
              <FeedbackPanel title="No staff profiles have been created yet.">
                Add at least one active team member to make services bookable on the public site.
              </FeedbackPanel>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminShell>
  );
}
