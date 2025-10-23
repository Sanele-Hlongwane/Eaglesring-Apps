export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Eagles Ring",
  description:
    "An investment platform that matches aspiring entrepreneurs with investment opportunities.",
  navItems: [
    { label: "Dashboard", href: "/" },
    { label: "About", href: "/about" },
    { label: "Investors", href: "/investors" },
    { label: "Entrepreneurs", href: "/entrepreneurs" },
    { label: "Contact", href: "/contact" },
  ],
  navMenuItems: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Investors", href: "/investors" },
    { label: "Entrepreneurs", href: "/entrepreneurs" },
    { label: "Contact", href: "/contact" },
  ],
  links: {
    twitter: "https://twitter.com/eaglesring",
    github: "https://github.com/eaglesring",
    discord: "https://discord.com/invite/eaglesring",
    sponsor: "https://icrdgroupholdings.com",
  },
};
