import type { ButtonStyle, HeadingFontKey, BodyFontKey } from "@/types/theme";

export type ShowcaseFeature = {
  title: string;
  description: string;
  iconKey: "globe" | "calendar" | "palette" | "mail" | "layout" | "shield";
};

export type ShowcaseStep = {
  title: string;
  description: string;
};

export type ShowcaseComparisonRow = {
  label: string;
  ownerControlled: string;
  marketplaceLed: string;
};

export type ShowcasePackage = {
  name: string;
  price: string;
  cadence: string;
  description: string;
  badge?: string;
  features: string[];
};

export type ShowcaseFaq = {
  question: string;
  answer: string;
};

export type ShowcaseThemePreview = {
  key: "luxury" | "pink" | "minimal";
  name: string;
  tagline: string;
  description: string;
  buttonStyle: ButtonStyle;
  headingFont: HeadingFontKey;
  bodyFont: BodyFontKey;
  borderRadius: string;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
  };
};
