"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AppNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">

        {/* LOGO */}
        <Link
          href="/"
          className="text-2xl font-bold text-black"
        >
          Codelura<span className="text-indigo-600">.</span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden items-center gap-6 md:flex text-gray-700">
          <NavDropdown
            title="Learn"
            items={[
              { label: "Blogs & Guides", href: "/blogs" },
              { label: "Premium Materials", href: "/materials" },
              { label: "Membership Plans", href: "/pricing" }
            ]}
          />

          <NavDropdown
            title="Build"
            items={[
              { label: "Website Development", href: "/services" },
              { label: "My Work", href: "/work" }
            ]}
          />

          <NavDropdown
            title="Mentorship"
            items={[
              { label: "1-to-1 Guidance", href: "https://topmate.io/" },
              { label: "Career Sessions", href: "https://unilearning.io/" }
            ]}
          />

          <Link
            href="/pricing"
            className="hover:text-black transition"
          >
            Pricing
          </Link>

          <Link
            href="/contact"
            className="hover:text-black transition"
          >
            Contact
          </Link>
        </div>

        {/* CTA */}
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-gray-700 hover:text-black"
            >
              Login
            </Button>
          </Link>

          <Link href="/pricing">
            <Button className="bg-black text-white hover:bg-gray-900">
              Get Started
            </Button>
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setOpen(!open)}
          className="text-xl text-black md:hidden"
        >
          ☰
        </button>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="border-t bg-white px-4 py-4 text-gray-700 md:hidden">
          <MobileLink href="/blogs">Blogs</MobileLink>
          <MobileLink href="/materials">Materials</MobileLink>
          <MobileLink href="/services">Services</MobileLink>
          <MobileLink href="/work">Work</MobileLink>
          <MobileLink href="/pricing">Pricing</MobileLink>
          <MobileLink href="/contact">Contact</MobileLink>
          <MobileLink href="/login">Login</MobileLink>
        </div>
      )}
    </header>
  );
}

/* ---------- DROPDOWN ---------- */

function NavDropdown({
  title,
  items
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div className="group relative">
      <button className="font-medium text-gray-700 hover:text-black transition">
        {title}
      </button>

      <div className="absolute left-0 top-full hidden w-48 rounded-md border bg-white shadow-md group-hover:block">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ---------- MOBILE LINK ---------- */

function MobileLink({
  href,
  children
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block py-2 text-gray-700 hover:text-black"
    >
      {children}
    </Link>
  );
}
