"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiOutlineViewGrid,
  HiOutlineDocumentText,
  HiOutlinePlusCircle,
  HiOutlineChatAlt2,
  HiOutlineTrendingUp,
  HiOutlineLogout,
  HiOutlineMenu
} from "react-icons/hi";
import { useState } from "react";

const menu = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: HiOutlineViewGrid
  },
  {
    name: "All Blogs",
    href: "/admin/blogs",
    icon: HiOutlineDocumentText
  },
  {
    name: "Create Blog",
    href: "/admin/blogs/create",
    icon: HiOutlinePlusCircle
  },
  {
    name: "Comments",
    href: "/admin/blogs/comments",
    icon: HiOutlineChatAlt2
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: HiOutlineTrendingUp
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
  };

  const SidebarContent = (
    <div className="flex h-full flex-col">
      {/* LOGO */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-white/10">
        <h1 className="text-2xl font-extrabold">
          Codelura<span className="text-indigo-600">.</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menu.map((item) => {
          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium
                transition-all
                ${
                  active
                    ? "bg-indigo-600 text-white shadow"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                }
              `}
            >
              <item.icon className="text-lg shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="p-4 border-t border-gray-200 dark:border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-2 text-sm 
          text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"
        >
          <HiOutlineLogout className="text-lg" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 
      flex items-center justify-between px-4 py-3 
      bg-white dark:bg-[#0f1220] border-b border-gray-200 dark:border-white/10">
        <h1 className="text-lg font-bold">
          Codelura<span className="text-indigo-600">.</span>
        </h1>
        <button
          onClick={() => setOpen(true)}
          className="text-gray-600 dark:text-gray-300"
        >
          <HiOutlineMenu className="text-2xl" />
        </button>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside
        className="
          hidden md:flex
          w-64 h-screen
          bg-white dark:bg-[#0f1220]
          border-r border-gray-200 dark:border-white/10
          sticky top-0
        "
      >
        {SidebarContent}
      </aside>

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* MOBILE SIDEBAR */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: open ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="
          fixed z-50 top-0 left-0 h-full w-64
          bg-white dark:bg-[#0f1220]
          border-r border-gray-200 dark:border-white/10
          md:hidden
        "
      >
        {SidebarContent}
      </motion.aside>
    </>
  );
}
