import { updateThemeSettings } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminSubmitButton } from "@/components/admin/admin-submit-button";
import { AdminField, AdminInput, AdminSelect } from "@/components/admin/admin-ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminThemeData } from "@/lib/data/admin";

export default async function AdminThemePage() {
  const data = await getAdminThemeData();

  return (
    <AdminShell currentPath="/admin/theme" isDemoMode={data.context.isDemoMode}>
      <AdminPageHeader
        eyebrow="Theme"
        title="Brand and theme settings"
        description="Update the salon-facing brand tokens that drive colors, type, radius, hero art, and button styling across the existing theme system."
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <Card>
          <CardHeader>
            <CardDescription>Theme configuration</CardDescription>
            <CardTitle className="text-2xl">Edit live tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateThemeSettings} className="grid gap-4 md:grid-cols-2">
              <input type="hidden" name="theme_id" value={data.themeSettings.id} />
              <input type="hidden" name="salon_id" value={data.context.salon.id} />
              <AdminField label="Brand name">
                <AdminInput name="brand_name" defaultValue={data.themeSettings.brand_name} />
              </AdminField>
              <AdminField label="Border radius">
                <AdminInput name="border_radius" defaultValue={data.themeSettings.border_radius} />
              </AdminField>
              <AdminField label="Primary color (HSL tokens)">
                <AdminInput name="primary_color" defaultValue={data.themeSettings.primary_color} />
              </AdminField>
              <AdminField label="Secondary color (HSL tokens)">
                <AdminInput name="secondary_color" defaultValue={data.themeSettings.secondary_color} />
              </AdminField>
              <AdminField label="Accent color (HSL tokens)">
                <AdminInput name="accent_color" defaultValue={data.themeSettings.accent_color} />
              </AdminField>
              <AdminField label="Background color (HSL tokens)">
                <AdminInput name="background_color" defaultValue={data.themeSettings.background_color} />
              </AdminField>
              <AdminField label="Foreground color (HSL tokens)">
                <AdminInput name="foreground_color" defaultValue={data.themeSettings.foreground_color} />
              </AdminField>
              <AdminField label="Button style">
                <AdminSelect name="button_style" defaultValue={data.themeSettings.button_style}>
                  <option value="pill">Pill</option>
                  <option value="rounded">Rounded</option>
                  <option value="square">Square</option>
                </AdminSelect>
              </AdminField>
              <AdminField label="Heading font">
                <AdminSelect name="heading_font" defaultValue={data.themeSettings.heading_font}>
                  <option value="cormorant-garamond">Cormorant Garamond</option>
                  <option value="playfair-display">Playfair Display</option>
                </AdminSelect>
              </AdminField>
              <AdminField label="Body font">
                <AdminSelect name="body_font" defaultValue={data.themeSettings.body_font}>
                  <option value="manrope">Manrope</option>
                  <option value="dm-sans">DM Sans</option>
                </AdminSelect>
              </AdminField>
              <AdminField label="Hero image URL" className="md:col-span-2">
                <AdminInput name="hero_image_url" defaultValue={data.themeSettings.hero_image_url ?? ""} />
              </AdminField>
              <AdminField label="Hero image alt" className="md:col-span-2">
                <AdminInput name="hero_image_alt" defaultValue={data.themeSettings.hero_image_alt ?? ""} />
              </AdminField>
              <AdminSubmitButton label="Save theme settings" pendingLabel="Saving..." className="md:col-span-2 md:w-fit" />
            </form>
          </CardContent>
        </Card>

        <Card className="bg-secondary/30">
          <CardHeader>
            <CardDescription>Preview notes</CardDescription>
            <CardTitle className="text-2xl">What updates immediately</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>Theme tokens now feed the runtime layout styles, public brand name, hero image, and button shape so changes are visible across the current experience after save.</p>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="font-heading text-3xl font-semibold text-foreground">{data.themeSettings.brand_name}</p>
              <p className="mt-2">Primary: {data.themeSettings.primary_color}</p>
              <p>Accent: {data.themeSettings.accent_color}</p>
              <p>Button style: {data.themeSettings.button_style}</p>
              <p>Hero image: {data.themeSettings.hero_image_url ?? "Not set"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
