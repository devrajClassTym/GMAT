"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./nav-links.module.css";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/diagnostic/practice", label: "Practice" },
  { href: "/exam", label: "Exam" },
];

export function NavLinks() {
  const pathname = usePathname();
  return <nav className={styles.nav} aria-label="Main navigation">{links.map(link =>
    <Link key={link.href} href={link.href} aria-current={pathname === link.href || pathname.startsWith(`${link.href}/`) ? "page" : undefined}>{link.label}</Link>
  )}</nav>;
}
