import { deleteService, deleteServiceAddon, upsertService, upsertServiceAddon } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminShell } from "@/components/admin/admin-shell";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { AdminSubmitButton } from "@/components/admin/admin-submit-button";
import { AdminCheckboxRow, AdminField, AdminInput, AdminTextarea } from "@/components/admin/admin-ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackPanel } from "@/components/ui/feedback-panel";
import { getAdminServicesData } from "@/lib/data/admin";
import { formatCurrency, formatDuration } from "@/lib/data/formatters";

export default async function AdminServicesPage() {
  const data = await getAdminServicesData();

  return (
    <AdminShell currentPath="/admin/services" isDemoMode={data.context.isDemoMode}>
      <AdminPageHeader
        eyebrow="Services"
        title="Service catalogue"
        description="Create and maintain the service menu, control active states and ordering, and manage add-ons from the same operational surface."
      />

      <Card>
        <CardHeader>
          <CardDescription>Create a new service</CardDescription>
          <CardTitle className="text-2xl">Add service</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={upsertService} className="grid gap-4 md:grid-cols-2">
            <input type="hidden" name="salon_id" value={data.context.salon.id} />
            <AdminField label="Service name">
              <AdminInput name="name" placeholder="Signature manicure" required />
            </AdminField>
            <AdminField label="Category">
              <AdminInput name="category" placeholder="Manicure" required />
            </AdminField>
            <AdminField label="Slug" hint="Optional. A clean URL slug will be generated from the name if left blank.">
              <AdminInput name="slug" placeholder="signature-manicure" />
            </AdminField>
            <AdminField label="Sort order" hint="Lower numbers appear first.">
              <AdminInput type="number" name="sort_order" defaultValue="0" />
            </AdminField>
            <AdminField label="Duration (minutes)">
              <AdminInput type="number" name="duration_minutes" defaultValue="45" min="0" required />
            </AdminField>
            <AdminField label="Base price (cents)" hint="For GBP 32.00, enter 3200.">
              <AdminInput type="number" name="price_from_cents" defaultValue="0" min="0" required />
            </AdminField>
            <AdminField label="Short description" className="md:col-span-2">
              <AdminInput name="short_description" placeholder="Refined polish work with cuticle care" />
            </AdminField>
            <AdminField label="Full description" className="md:col-span-2">
              <AdminTextarea name="description" placeholder="Add a richer internal and public-facing service description" />
            </AdminField>
            <div className="grid gap-3 md:col-span-2 md:grid-cols-2">
              <AdminCheckboxRow label="Active service" description="Keep this service bookable and visible on the public site." inputProps={{ name: "is_active", defaultChecked: true }} />
              <AdminCheckboxRow label="Featured service" description="Allow this service to appear in featured marketing placements." inputProps={{ name: "is_featured" }} />
            </div>
            <AdminSubmitButton label="Create service" pendingLabel="Creating..." className="md:col-span-2 md:w-fit" />
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {data.services.length ? (
          data.services.map((record) => (
            <Card key={record.service.id}>
              <CardHeader>
                <CardDescription>
                  {record.service.category} · {record.assignedStaffIds.length} staff assigned · {formatCurrency(record.service.price_from_cents, data.context.salon.currency_code)} / {formatDuration(record.service.duration_minutes)}
                </CardDescription>
                <CardTitle className="text-2xl">{record.service.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form action={upsertService} className="grid gap-4 md:grid-cols-2">
                  <input type="hidden" name="service_id" value={record.service.id} />
                  <input type="hidden" name="salon_id" value={data.context.salon.id} />
                  <AdminField label="Service name">
                    <AdminInput name="name" defaultValue={record.service.name} required />
                  </AdminField>
                  <AdminField label="Category">
                    <AdminInput name="category" defaultValue={record.service.category} required />
                  </AdminField>
                  <AdminField label="Slug">
                    <AdminInput name="slug" defaultValue={record.service.slug} />
                  </AdminField>
                  <AdminField label="Sort order">
                    <AdminInput type="number" name="sort_order" defaultValue={record.service.sort_order} />
                  </AdminField>
                  <AdminField label="Duration (minutes)">
                    <AdminInput type="number" name="duration_minutes" defaultValue={record.service.duration_minutes} min="0" required />
                  </AdminField>
                  <AdminField label="Base price (cents)">
                    <AdminInput type="number" name="price_from_cents" defaultValue={record.service.price_from_cents} min="0" required />
                  </AdminField>
                  <AdminField label="Short description" className="md:col-span-2">
                    <AdminInput name="short_description" defaultValue={record.service.short_description ?? ""} />
                  </AdminField>
                  <AdminField label="Full description" className="md:col-span-2">
                    <AdminTextarea name="description" defaultValue={record.service.description ?? ""} />
                  </AdminField>
                  <div className="grid gap-3 md:col-span-2 md:grid-cols-2">
                    <AdminCheckboxRow label="Active service" inputProps={{ name: "is_active", defaultChecked: record.service.is_active }} />
                    <AdminCheckboxRow label="Featured service" inputProps={{ name: "is_featured", defaultChecked: record.service.is_featured }} />
                  </div>
                  <div className="flex flex-wrap gap-3 md:col-span-2">
                    <AdminSubmitButton label="Save service" pendingLabel="Saving..." />
                  </div>
                </form>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-rose-200 bg-rose-50/70 px-4 py-4">
                  <div className="text-sm leading-6 text-rose-800">
                    <p className="font-medium text-foreground">Delete this service</p>
                    <p>Use this only if the service should be removed from the live catalogue entirely.</p>
                  </div>
                  <form action={deleteService}>
                    <input type="hidden" name="service_id" value={record.service.id} />
                    <ConfirmSubmitButton
                      label="Delete service"
                      pendingLabel="Deleting..."
                      confirmMessage={`Delete ${record.service.name}? This cannot be undone from the demo UI.`}
                    />
                  </form>
                </div>

                <div className="space-y-4 rounded-3xl border border-border/70 bg-secondary/25 p-4">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">Add-ons</p>
                    <p className="text-sm text-muted-foreground">Manage optional enhancements linked to this service.</p>
                  </div>

                  {record.addons.length ? (
                    record.addons.map((addon) => (
                      <div key={addon.id} className="space-y-3 rounded-2xl border border-border/70 bg-background/80 p-4">
                        <form action={upsertServiceAddon} className="grid gap-4 md:grid-cols-2">
                          <input type="hidden" name="addon_id" value={addon.id} />
                          <input type="hidden" name="salon_id" value={data.context.salon.id} />
                          <input type="hidden" name="service_id" value={record.service.id} />
                          <AdminField label="Add-on name">
                            <AdminInput name="name" defaultValue={addon.name} required />
                          </AdminField>
                          <AdminField label="Sort order">
                            <AdminInput type="number" name="sort_order" defaultValue={addon.sort_order} />
                          </AdminField>
                          <AdminField label="Duration (minutes)">
                            <AdminInput type="number" name="duration_minutes" defaultValue={addon.duration_minutes} min="0" required />
                          </AdminField>
                          <AdminField label="Price (cents)">
                            <AdminInput type="number" name="price_cents" defaultValue={addon.price_cents} min="0" required />
                          </AdminField>
                          <AdminField label="Description" className="md:col-span-2">
                            <AdminTextarea name="description" defaultValue={addon.description ?? ""} />
                          </AdminField>
                          <div className="md:col-span-2">
                            <AdminCheckboxRow label="Active add-on" inputProps={{ name: "is_active", defaultChecked: addon.is_active }} />
                          </div>
                          <div className="flex flex-wrap gap-3 md:col-span-2">
                            <AdminSubmitButton label="Save add-on" pendingLabel="Saving..." />
                          </div>
                        </form>
                        <form action={deleteServiceAddon}>
                          <input type="hidden" name="addon_id" value={addon.id} />
                          <ConfirmSubmitButton
                            label={`Delete ${addon.name}`}
                            pendingLabel="Deleting..."
                            confirmMessage={`Delete ${addon.name}? This add-on will no longer be available for ${record.service.name}.`}
                          />
                        </form>
                      </div>
                    ))
                  ) : (
                    <FeedbackPanel title="No add-ons linked yet.">
                      Add-ons are optional, so this service can stay live without them.
                    </FeedbackPanel>
                  )}

                  <form action={upsertServiceAddon} className="grid gap-4 rounded-2xl border border-dashed border-border/70 bg-background/70 p-4 md:grid-cols-2">
                    <input type="hidden" name="salon_id" value={data.context.salon.id} />
                    <input type="hidden" name="service_id" value={record.service.id} />
                    <AdminField label="New add-on name">
                      <AdminInput name="name" placeholder="French finish" required />
                    </AdminField>
                    <AdminField label="Sort order">
                      <AdminInput type="number" name="sort_order" defaultValue="0" />
                    </AdminField>
                    <AdminField label="Duration (minutes)">
                      <AdminInput type="number" name="duration_minutes" defaultValue="0" min="0" required />
                    </AdminField>
                    <AdminField label="Price (cents)">
                      <AdminInput type="number" name="price_cents" defaultValue="0" min="0" required />
                    </AdminField>
                    <AdminField label="Description" className="md:col-span-2">
                      <AdminTextarea name="description" placeholder="Optional enhancement description" />
                    </AdminField>
                    <div className="md:col-span-2">
                      <AdminCheckboxRow label="Active add-on" inputProps={{ name: "is_active", defaultChecked: true }} />
                    </div>
                    <AdminSubmitButton label="Add add-on" pendingLabel="Adding..." className="md:col-span-2 md:w-fit" />
                  </form>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-6">
              <FeedbackPanel title="No services have been created yet.">
                Use the form above to add the first public-facing service to the catalogue.
              </FeedbackPanel>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminShell>
  );
}
