import { themeConfig } from "@/config/theme";
import type { NavItem } from "@/types/site";

export const siteConfig = {
  name: themeConfig.brandName,
  description:
    "A modular showcase scaffold for a nail salon platform built with Next.js, Tailwind CSS, shadcn/ui patterns, and Supabase-ready structure.",
};

export const mainNav: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "Services", href: "/services" },
  { title: "Gallery", href: "/gallery" },
  { title: "Contact", href: "/contact" },
  { title: "Booking", href: "/booking" },
  { title: "For Salons", href: "/for-salons" },
];

export const footerNav: NavItem[] = [
  { title: "Services", href: "/services" },
  { title: "Gallery", href: "/gallery" },
  { title: "Contact", href: "/contact" },
  { title: "For Salons", href: "/for-salons" },
  { title: "Admin", href: "/admin" },
];
