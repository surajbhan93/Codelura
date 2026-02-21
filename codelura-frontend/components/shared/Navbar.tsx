"use client";

import Link from "next/link";
import { User } from "lucide-react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Menu,
  X,
  BookOpen,
  Code2,
  Users
} from "lucide-react";

export default function AppNavbar() {
  const [open, setOpen] = useState(false);
 const [role, setRole] = useState<string | null>(null);
const [accountOpen, setAccountOpen] = useState(false);

useEffect(() => {
  const userRole = localStorage.getItem("role");
  setRole(userRole);

}, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-black/5">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">

        {/* LOGO */}
        <Link href="/" className="text-2xl font-extrabold text-black">
          Codelura<span className="text-indigo-600">.</span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <NavDropdown
            title="Learn"
            icon={<BookOpen size={16} />}
            items={[
              { label: "Blogs & Guides", href: "/blogs" },
              { label: "Premium Materials", href: "/courses" },
              { label: "Membership Plans", href: "/pricing" }
            ]}
          />

          <NavDropdown
            title="Build"
            icon={<Code2 size={16} />}
            items={[
              { label: "Website Development", href: "/services" },
              { label: "My Work", href: "/work" }
            ]}
          />

          <NavDropdown
            title="Mentorship"
            icon={<Users size={16} />}
            items={[
              { label: "1-to-1 Guidance", href: "https://topmate.io/" },
              { label: "Career Sessions", href: "https://unilearning.io/" }
            ]}
          />

          <Link href="/pricing" className="hover:text-black transition">
            Pricing
          </Link>

          <Link href="/contact" className="hover:text-black transition">
            Contact
          </Link>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3 relative">
  {!role ? (
    <>
      <Link href="/auth/login">
        <Button variant="ghost" className="text-gray-700 hover:text-black">
          Login
        </Button>
      </Link>

      <Link href="/pricing">
        <Button className="rounded-full bg-indigo-600 text-white">
          Get Started
        </Button>
      </Link>
    </>
  ) : (
    <div className="relative">
      {/* ACCOUNT ICON */}
      <button
        onClick={() => setAccountOpen(!accountOpen)}
        className="flex items-center gap-2 text-gray-700 hover:text-black"
      >
        <User size={22} />
        <ChevronDown
          size={16}
          className={`transition ${accountOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* DROPDOWN */}
      {accountOpen && (
        <div className="absolute right-0 mt-3 w-44 rounded-xl border border-black/5 bg-white shadow-xl overflow-hidden z-50">
          
          <Link
            href={role === "admin" ? "/admin" : "/dashboard"}
            className="block px-4 py-3 text-sm hover:bg-gray-50"
          >
            Dashboard
          </Link>

          <Link
            href="/profile"
            className="block px-4 py-3 text-sm hover:bg-gray-50"
          >
            Profile
          </Link>

          <Link
            href="/pricing"
            className="block px-4 py-3 text-sm hover:bg-gray-50"
          >
            Pricing
          </Link>

          <Link
            href="/contact"
            className="block px-4 py-3 text-sm hover:bg-gray-50"
          >
            Contact
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("role");
              window.location.href = "/auth/login";
            }}
            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )}
</div>


          <Link href="/pricing">
            <Button className="rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow">
              Get Started
            </Button>
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-black"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t bg-white px-6 py-6 space-y-4 text-gray-700">
          <MobileLink href="/blogs">Blogs & Guides</MobileLink>
          <MobileLink href="/courses">Premium Materials</MobileLink>
          <MobileLink href="/services">Services</MobileLink>
          <MobileLink href="/work">My Work</MobileLink>
          <MobileLink href="/pricing">Pricing</MobileLink>
          <MobileLink href="/contact">Contact</MobileLink>
        {!role ? (
  <MobileLink href="/auth/login">Login</MobileLink>
) : (
  <div>
    {/* ACCOUNT BUTTON */}
    <button
      onClick={() => setAccountOpen(!accountOpen)}
      className="flex w-full items-center justify-between py-2 text-base font-medium"
    >
      <div className="flex items-center gap-2">
        <User size={20} />
        Account
      </div>
      <ChevronDown
        size={18}
        className={`transition ${accountOpen ? "rotate-180" : ""}`}
      />
    </button>

    {/* DROPDOWN */}
    {accountOpen && (
      <div className="ml-6 mt-2 space-y-2 text-sm text-gray-700">
        <MobileLink href={role === "admin" ? "/admin" : "/dashboard"}>
          Dashboard
        </MobileLink>

        <MobileLink href="/profile">Profile</MobileLink>

        <MobileLink href="/pricing">Pricing</MobileLink>

        <MobileLink href="/contact">Contact</MobileLink>

        {/* LOGOUT */}
        <button
          onClick={() => {
            localStorage.removeItem("role");
            window.location.href = "/auth/login";
          }}
          className="block w-full text-left py-2 text-red-600 hover:text-red-700"
        >
          Logout
        </button>
      </div>
    )}
  </div>
)}



          <Link href="/pricing">
            <Button className="w-full mt-4 rounded-full bg-indigo-600 text-white">
              Get Started
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}

/* ---------- DROPDOWN ---------- */

function NavDropdown({
  title,
  icon,
  items
}: {
  title: string;
  icon: React.ReactNode;
  items: { label: string; href: string }[];
}) {
  return (
    <div className="group relative">
      <button className="flex items-center gap-1 hover:text-black transition">
        {icon}
        {title}
        <ChevronDown size={14} className="opacity-60 group-hover:rotate-180 transition" />
      </button>

      <div className="absolute left-0 top-full mt-3 hidden w-56 rounded-xl border border-black/5 bg-white shadow-xl group-hover:block overflow-hidden">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition"
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
      className="block py-2 text-base hover:text-black transition"
    >
      {children}
    </Link>
  );
}
