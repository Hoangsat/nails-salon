import type { CSSProperties } from "react";

import type { ButtonStyle, ThemeConfig } from "@/types/theme";

const bodyFonts = {
  manrope: '"Manrope", "Aptos", "Segoe UI", sans-serif',
  "dm-sans": '"DM Sans", "Aptos", "Segoe UI", sans-serif',
} as const;

const headingFonts = {
  "cormorant-garamond": '"Cormorant Garamond", "Times New Roman", serif',
  "playfair-display": '"Playfair Display", "Times New Roman", serif',
} as const;

export const themeFontVariables = "";

export function getThemeStyles(theme: ThemeConfig): CSSProperties {
  return {
    "--background": theme.colors.background,
    "--foreground": theme.colors.foreground,
    "--card": theme.colors.card,
    "--card-foreground": theme.colors["card-foreground"],
    "--popover": theme.colors.popover,
    "--popover-foreground": theme.colors["popover-foreground"],
    "--primary": theme.colors.primary,
    "--primary-foreground": theme.colors["primary-foreground"],
    "--secondary": theme.colors.secondary,
    "--secondary-foreground": theme.colors["secondary-foreground"],
    "--muted": theme.colors.muted,
    "--muted-foreground": theme.colors["muted-foreground"],
    "--accent": theme.colors.accent,
    "--accent-foreground": theme.colors["accent-foreground"],
    "--destructive": theme.colors.destructive,
    "--destructive-foreground": theme.colors["destructive-foreground"],
    "--border": theme.colors.border,
    "--input": theme.colors.input,
    "--ring": theme.colors.ring,
    "--font-body": bodyFonts[theme.fonts.body],
    "--font-heading": headingFonts[theme.fonts.heading],
    "--radius": theme.borderRadius,
  } as CSSProperties;
}

export function getButtonShapeClass(buttonStyle: ButtonStyle) {
  const buttonStyleMap: Record<ButtonStyle, string> = {
    rounded: "rounded-xl",
    pill: "rounded-full",
    square: "rounded-md",
  };

  return buttonStyleMap[buttonStyle];
}
