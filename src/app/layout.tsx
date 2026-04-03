import type { Metadata } from "next";

import "@/app/globals.css";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/config/site";
import { getSalonThemeSettings } from "@/lib/data/public";
import { createThemeConfigFromSettings } from "@/lib/data/mappers";
import { getThemeStyles, themeFontVariables } from "@/lib/theme";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const runtimeTheme = createThemeConfigFromSettings(await getSalonThemeSettings());

  return (
    <html
      lang="en"
      className={themeFontVariables}
      style={getThemeStyles(runtimeTheme)}
      data-button-style={runtimeTheme.buttonStyle}
      suppressHydrationWarning
    >
      <body className={cn("min-h-screen bg-background text-foreground")}>
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
