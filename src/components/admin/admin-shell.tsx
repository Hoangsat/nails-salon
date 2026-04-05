import Link from "next/link";
import { type PropsWithChildren } from "react";
import { ExternalLink } from "lucide-react";

import { logoutAction } from "@/app/login/actions";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentAdminUser, isSupabaseAuthConfigured } from "@/lib/auth/supabase-auth";
import { cn } from "@/lib/utils";

const adminNav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/appointments", label: "Appointments" },
  { href: "/admin/calendar", label: "Calendar" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/staff", label: "Staff" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/theme", label: "Theme" },
  { href: "/admin/notifications", label: "Notifications" },
];

export async function AdminShell({
  currentPath,
  isDemoMode,
  children,
}: PropsWithChildren<{ currentPath: string; isDemoMode: boolean }>) {
  const authEnabled = isSupabaseAuthConfigured();
  const currentUser = authEnabled ? await getCurrentAdminUser() : null;

  return (
    <section className="py-10 sm:py-12">
      <Container className="grid gap-6 lg:grid-cols-[256px,1fr] lg:items-start">
        <aside className="lg:sticky lg:top-24">
          <div className="rounded-[calc(var(--radius)+0.2rem)] border border-border/70 bg-card/90 p-4 shadow-soft backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="font-heading text-2xl font-semibold">Admin</p>
              <Badge variant="outline">{authEnabled ? "Protected" : "Demo access"}</Badge>
            </div>
            <p className="mb-4 text-sm leading-6 text-muted-foreground">
              {authEnabled
                ? "Signed-in Supabase users can access the admin for this demo, keeping the setup intentionally light while leaving room for future roles and permissions."
                : "Supabase Auth is not configured in this environment yet, so admin access remains open for local preview."}
            </p>
            {currentUser?.email ? (
              <div className="mb-4 rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Signed in</p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">{currentUser.email}</p>
                  <form action={logoutAction}>
                    <Button type="submit" size="sm" variant="outline">
                      Log out
                    </Button>
                  </form>
                </div>
              </div>
            ) : null}
            {isDemoMode ? (
              <div className="mb-4 rounded-2xl border border-dashed border-border/70 bg-secondary/35 px-4 py-3 text-sm text-muted-foreground">
                Supabase is not configured, so these admin pages are showing demo read data and write actions will require a real backend connection.
              </div>
            ) : null}
            <div className="mb-4 grid gap-2">
              <Button asChild variant="outline" size="sm" className="justify-between">
                <Link href="/" target="_blank" rel="noreferrer">
                  View public site
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <nav className="grid gap-2">
              {adminNav.map((item) => {
                const active = currentPath === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
        <div className="space-y-6">{children}</div>
      </Container>
    </section>
  );
}
