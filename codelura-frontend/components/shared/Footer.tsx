"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300">
      {/* MAIN SECTION */}
      <div className="mx-auto max-w-7xl px-6 py-20 grid gap-14 md:grid-cols-4">

        {/* ABOUT */}
        <div>
          <h2 className="text-3xl font-bold text-white">
            Codelura<span className="text-indigo-500">.</span>
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-gray-400">
            Codelura is a premium learning & service platform for developers.
            Learn with real-world content, unlock premium resources, get
            mentorship, and build high-performance websites.
          </p>
        </div>

        {/* RESOURCES */}
        <div>
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
            Resources
          </h3>
          <ul className="space-y-3 text-sm">
            {[
              ["Blogs", "/blogs"],
              ["Materials", "/materials"],
              ["Pricing", "/pricing"],
              ["Services", "/services"],
            ].map(([label, href]) => (
              <li key={label}>
                <Link href={href} className="hover:text-white transition">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
            Company
          </h3>
          <ul className="space-y-3 text-sm">
            {[
              ["About Us", "/about"],
              ["Privacy Policy", "/privacy"],
              ["Terms", "/terms"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <li key={label}>
                <Link href={href} className="hover:text-white transition">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CONNECT */}
        <div>
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
            Connect With Us
          </h3>

          {/* SOCIAL ICONS (FORCED VISIBLE) */}
          <div className="flex gap-4 mb-8">
            {[
              ["facebook.svg", "https://facebook.com"],
              ["instagram.svg", "https://instagram.com"],
              ["twitter.svg", "https://twitter.com"],
              ["LI-In-Bug.png", "https://linkedin.com"],
              ["youtube.png", "https://youtube.com"],
            ].map(([icon, link]) => (
              <a
                key={icon}
                href={link}
                target="_blank"
                className="h-10 w-10 rounded-full bg-[#1a1a1a] flex items-center justify-center hover:bg-indigo-600 transition"
              >
                <Image
                  src={`/footer/${icon}`}
                  alt="social"
                  width={18}
                  height={18}
                  className="invert"
                />
              </a>
            ))}
          </div>

          {/* SUBSCRIBE */}
          <h4 className="mb-3 text-sm font-semibold text-white">
            Keep Up To Date
          </h4>

          <div className="flex items-center rounded-full bg-[#1a1a1a] p-1">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-transparent px-4 text-sm text-white placeholder-gray-400 outline-none"
            />
            <button className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              Subscribe
            </button>
          </div>

          {/* APP */}
          <h4 className="mt-6 mb-3 text-sm font-semibold text-white">
            Download The App
          </h4>
          <div className="flex gap-3">
            <Image
              src="/footer/google-play.svg"
              alt="Google Play"
              width={130}
              height={40}
              className="brightness-110"
            />
            <Image
              src="/footer/app-store.svg"
              alt="App Store"
              width={130}
              height={40}
              className="brightness-110"
            />
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6">

          {/* PAYMENTS */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              100% Secure Payment
            </p>
            <div className="flex gap-4">
              {[
                "googlepay",
                "paytm",
                "paypal",
                "visa",
                "apple",
                "mastercard",
              ].map((icon) => (
                <div
                  key={icon}
                  className="h-10 px-3 flex items-center rounded-md bg-[#1a1a1a]"
                >
                  <Image
                    src={`/footer/${icon}.svg`}
                    alt={icon}
                    width={40}
                    height={24}
                    className="invert opacity-90"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* COPYRIGHT */}
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Codelura. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
