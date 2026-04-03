import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertCircle, LockKeyhole, Palette, ShieldCheck } from "lucide-react";

import { AdminInput } from "@/components/admin/admin-ui";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackPanel } from "@/components/ui/feedback-panel";
import { getCurrentAdminUser, isSupabaseAuthConfigured, normalizeAdminRedirectPath } from "@/lib/auth/supabase-auth";
import { getSalonThemeSettings } from "@/lib/data/public";

import { loginAction } from "./actions";

type LoginPageProps = {
  searchParams?: {
    error?: string | string[];
    next?: string | string[];
  };
};

function readSearchParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

const loginHighlights = [
  {
    icon: LockKeyhole,
    title: "Protected admin routes",
    description: "Unauthenticated visits to /admin are redirected here automatically.",
  },
  {
    icon: ShieldCheck,
    title: "Light access model",
    description: "Any authenticated Supabase user counts as an admin for now.",
  },
  {
    icon: Palette,
    title: "Presentation-ready control",
    description: "Bookings, services, staff, settings, theme updates, and notifications live behind one login.",
  },
];

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const authEnabled = isSupabaseAuthConfigured();
  const nextPath = normalizeAdminRedirectPath(readSearchParam(searchParams?.next));
  const errorMessage = readSearchParam(searchParams?.error);
  const themeSettings = await getSalonThemeSettings();

  if (authEnabled) {
    const currentUser = await getCurrentAdminUser();

    if (currentUser) {
      redirect(nextPath);
    }
  }

  return (
    <section className="py-16 sm:py-20">
      <Container className="grid gap-8 lg:grid-cols-[0.9fr,1.1fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Admin Sign In</p>
          <div className="space-y-4">
            <h1 className="font-heading text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
              Manage {themeSettings.brandName} with a clean, protected admin flow.
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Sign in with a Supabase Auth email and password to manage bookings, services, staff, salon settings, theme controls, and notification history.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {loginHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="rounded-[calc(var(--radius)+0.2rem)] border border-border/70 bg-card/80 p-5 shadow-soft">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/for-salons">View showcase page</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Back to public site</Link>
            </Button>
          </div>
        </div>

        <Card className="bg-background/95">
          <CardHeader>
            <CardTitle>Sign in to the admin</CardTitle>
            <CardDescription>
              Use an email/password account created in your Supabase project. Public customer accounts are intentionally not part of this demo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!authEnabled ? (
              <FeedbackPanel variant="warning" title="Supabase Auth is not configured in this environment yet." icon={<AlertCircle className="h-4 w-4" />}>
                The login form is disabled for this preview, and admin access remains open so the demo can still be explored locally.
                <div className="mt-4">
                  <Button asChild>
                    <Link href="/admin">Continue to the admin demo</Link>
                  </Button>
                </div>
              </FeedbackPanel>
            ) : (
              <form action={loginAction} className="grid gap-4">
                <input type="hidden" name="next" value={nextPath} />
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-foreground">Email</span>
                  <AdminInput name="email" type="email" autoComplete="email" placeholder="admin@studio.co.uk" required />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-foreground">Password</span>
                  <AdminInput
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                  />
                </label>
                {errorMessage ? (
                  <FeedbackPanel variant="error" title="Sign-in failed" icon={<AlertCircle className="h-4 w-4" />}>
                    {errorMessage}
                  </FeedbackPanel>
                ) : null}
                <Button type="submit" size="lg" className="w-full">
                  Sign in
                </Button>
              </form>
            )}

            <FeedbackPanel title="Quick setup note">
              Create a single email/password user in Supabase Auth, add the project URL and anon key to your environment, and the protected admin flow will work without adding roles or customer accounts.
            </FeedbackPanel>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
