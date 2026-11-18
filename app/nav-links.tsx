"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/diagnostic/practice", label: "Practice" },
  { href: "/exam", label: "Exam" },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav
      className="flex items-center gap-1.5 max-[700px]:order-3 max-[700px]:w-full"
      aria-label="Main navigation"
    >
      {links.map((link) => (
        <Link
          key={link.href}
          className="rounded-lg border border-transparent px-3.5 py-[9px] text-[12px] font-[550] whitespace-nowrap text-muted hover:border-line hover:bg-surface hover:text-foreground aria-[current=page]:border-[color-mix(in_srgb,var(--accent)_25%,var(--line))] aria-[current=page]:bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface))] aria-[current=page]:text-accent focus-visible:outline-3 focus-visible:outline-focus focus-visible:outline-offset-3 max-[700px]:flex-1 max-[700px]:px-2.5 max-[700px]:text-center"
          href={link.href}
          aria-current={
            pathname === link.href || pathname.startsWith(`${link.href}/`)
              ? "page"
              : undefined
          }
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
