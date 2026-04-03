export type BodyFontKey = "manrope" | "dm-sans";

export type HeadingFontKey = "cormorant-garamond" | "playfair-display";

export type ButtonStyle = "rounded" | "pill" | "square";

export type ThemeColors = {
  background: string;
  foreground: string;
  card: string;
  "card-foreground": string;
  popover: string;
  "popover-foreground": string;
  primary: string;
  "primary-foreground": string;
  secondary: string;
  "secondary-foreground": string;
  muted: string;
  "muted-foreground": string;
  accent: string;
  "accent-foreground": string;
  destructive: string;
  "destructive-foreground": string;
  border: string;
  input: string;
  ring: string;
};

export type ThemeConfig = {
  brandName: string;
  colors: ThemeColors;
  fonts: {
    body: BodyFontKey;
    heading: HeadingFontKey;
  };
  buttonStyle: ButtonStyle;
  borderRadius: string;
  heroImage: string;
};

