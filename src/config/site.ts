import { themeConfig } from "@/config/theme";
import type { NavItem } from "@/types/site";

export const siteConfig = {
  name: themeConfig.brandName,
  description:
    "USA Nails Corstorphine in Edinburgh for manicures, pedicures, nail design, and direct online booking.",
};

export const mainNav: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "Services", href: "/services" },
  { title: "Gallery", href: "/gallery" },
  { title: "Contact", href: "/contact" },
  { title: "Booking", href: "/booking" },
];

export const footerNav: NavItem[] = [
  { title: "Services", href: "/services" },
  { title: "Gallery", href: "/gallery" },
  { title: "Contact", href: "/contact" },
  { title: "Admin", href: "/admin" },
];
