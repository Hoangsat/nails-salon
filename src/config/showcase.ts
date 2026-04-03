import type {
  ShowcaseComparisonRow,
  ShowcaseFaq,
  ShowcaseFeature,
  ShowcasePackage,
  ShowcaseStep,
  ShowcaseThemePreview,
} from "@/types/showcase";

export const showcaseFeatures: ShowcaseFeature[] = [
  {
    title: "Your own branded website",
    description: "A salon-first site that looks professional on mobile, reflects your brand, and feels like a premium local business rather than a generic listing.",
    iconKey: "globe",
  },
  {
    title: "Direct online bookings",
    description: "Take bookings straight through your own site so clients come to you first, without relying on third-party marketplaces for every appointment.",
    iconKey: "calendar",
  },
  {
    title: "Customizable look and feel",
    description: "Colours, fonts, button styles, hero visuals, and overall presentation can be tuned to fit luxury, feminine, or minimal brand directions.",
    iconKey: "palette",
  },
  {
    title: "Automatic email confirmations",
    description: "Clients receive polished booking confirmations while the salon keeps a visible log of notification attempts in the admin area.",
    iconKey: "mail",
  },
  {
    title: "Admin control without clutter",
    description: "Manage services, staff, bookings, opening hours, theme settings, and customer records from one straightforward dashboard.",
    iconKey: "layout",
  },
  {
    title: "Built for a real salon workflow",
    description: "Availability, booking creation, and a clean admin flow are already in place, so this reads like a service you can actually sell rather than a brochure only.",
    iconKey: "shield",
  },
];

export const showcaseSteps: ShowcaseStep[] = [
  {
    title: "Choose the brand direction",
    description: "We start with your salon style, colours, tone, and the type of clients you want to attract so the website feels like your business from day one.",
  },
  {
    title: "Launch your branded booking site",
    description: "Your services, team, gallery, opening hours, and contact details are set up in a polished customer-facing experience with direct online booking.",
  },
  {
    title: "Run day-to-day from the admin",
    description: "Update pricing, staff availability, theme settings, and appointment statuses without needing a developer for every small change.",
  },
];

export const showcaseComparisonRows: ShowcaseComparisonRow[] = [
  {
    label: "Branding",
    ownerControlled: "Your salon name, visuals, and tone lead the experience.",
    marketplaceLed: "Your salon often sits inside somebody else’s layout and conversion funnel.",
  },
  {
    label: "Client relationship",
    ownerControlled: "Clients book directly with you and stay closer to your own brand.",
    marketplaceLed: "The platform often becomes the primary destination clients remember.",
  },
  {
    label: "Flexibility",
    ownerControlled: "Theme, packages, service structure, and admin workflows can be tailored.",
    marketplaceLed: "You usually work within fixed templates and platform constraints.",
  },
  {
    label: "Commercial model",
    ownerControlled: "A clearer monthly service cost with more control over your own conversion path.",
    marketplaceLed: "Commission or platform dependence can keep rising as bookings grow.",
  },
];

export const showcasePackages: ShowcasePackage[] = [
  {
    name: "Launch setup",
    price: "GBP 499",
    cadence: "one-time",
    description: "Ideal for getting a salon online quickly with a polished branded website and booking setup.",
    badge: "Most common starting point",
    features: [
      "Branded salon website setup",
      "Service menu, staff, gallery, and contact migration",
      "Booking flow configuration",
      "Theme styling to suit your brand",
    ],
  },
  {
    name: "Essential plan",
    price: "GBP 89",
    cadence: "per month",
    description: "A straightforward package for salons that want direct online bookings and a professional online presence.",
    features: [
      "Hosting and ongoing maintenance",
      "Admin access for services, staff, and bookings",
      "Email confirmations included",
      "Monthly content/style updates",
    ],
  },
  {
    name: "Pro plan",
    price: "GBP 149",
    cadence: "per month",
    description: "For salons that want a more premium brand presentation and faster iteration on campaigns, offers, and content.",
    badge: "Best for growth",
    features: [
      "Everything in Essential",
      "Priority update support",
      "Quarterly design refreshes and landing-page tweaks",
      "Deeper theme customization and launch support",
    ],
  },
  {
    name: "SMS reminder add-on",
    price: "GBP 19",
    cadence: "per month + usage",
    description: "Optional add-on for a later phase when reminder messaging is turned on.",
    features: [
      "Reminder-ready architecture already planned",
      "Suitable for appointment confirmations and reminders later",
      "Kept optional so salons only pay for it if needed",
    ],
  },
];

export const showcaseFaqs: ShowcaseFaq[] = [
  {
    question: "Is this only a design mock-up, or does it actually book appointments?",
    answer: "This demo already includes a real booking flow, database-backed availability, admin management, and email confirmations. It is positioned like a sellable service rather than a static concept page.",
  },
  {
    question: "Can the website match my salon brand?",
    answer: "Yes. The theme system supports brand name, colours, fonts, border radius, button style, and hero imagery so the site can move between luxury, feminine, and minimal directions without rebuilding the product.",
  },
  {
    question: "Do I need to stay on third-party marketplaces?",
    answer: "Not necessarily. This is designed to help salons own more of their direct booking journey and rely less on platforms that control the customer relationship.",
  },
  {
    question: "Can I update services and staff myself?",
    answer: "Yes. The admin area already supports managing services, add-ons, staff, working hours, bookings, salon settings, theme settings, and notification logs.",
  },
  {
    question: "What happens after launch?",
    answer: "The typical next step is ongoing maintenance, small content updates, and optional upgrades like reminder messaging or additional sales pages as the salon grows.",
  },
];

export const showcaseThemePreviews: ShowcaseThemePreview[] = [
  {
    key: "luxury",
    name: "Luxury Editorial",
    tagline: "For salons selling a premium, appointment-led experience.",
    description: "Warm neutrals, elevated serif headings, and softer rounded details suited to a refined studio brand.",
    buttonStyle: "pill",
    headingFont: "cormorant-garamond",
    bodyFont: "manrope",
    borderRadius: "1.5rem",
    colors: {
      background: "34 36% 97%",
      foreground: "20 22% 16%",
      primary: "19 63% 44%",
      secondary: "32 38% 90%",
      accent: "18 47% 78%",
    },
  },
  {
    key: "pink",
    name: "Soft Pink Studio",
    tagline: "For a polished, feminine salon brand with warmth and personality.",
    description: "Blush-led tones, playful softness, and rounded touchpoints that still feel premium and conversion-focused.",
    buttonStyle: "rounded",
    headingFont: "playfair-display",
    bodyFont: "dm-sans",
    borderRadius: "1.25rem",
    colors: {
      background: "340 100% 98%",
      foreground: "338 22% 20%",
      primary: "339 73% 58%",
      secondary: "344 73% 93%",
      accent: "18 79% 86%",
    },
  },
  {
    key: "minimal",
    name: "Minimal Clean",
    tagline: "For salons that want a crisp, modern brand without visual clutter.",
    description: "Low-noise neutrals, straight edges, and a more understated interface that still feels bespoke.",
    buttonStyle: "square",
    headingFont: "playfair-display",
    bodyFont: "manrope",
    borderRadius: "0.85rem",
    colors: {
      background: "210 20% 98%",
      foreground: "218 22% 14%",
      primary: "210 65% 30%",
      secondary: "210 18% 92%",
      accent: "190 32% 84%",
    },
  },
];
