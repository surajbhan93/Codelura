// (ONLY layout)
"use client";

// (ONLY layout)
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        min-h-screen flex
        bg-gray-50 dark:bg-[#0b0d17]
      "
    >
      {/* LEFT SIDEBAR */}
      <aside
        className="
          hidden md:flex
          w-64
          bg-white dark:bg-[#0f1220]
          border-r border-gray-200 dark:border-white/10
          sticky top-0 h-screen
        "
      >
        <AdminSidebar />
      </aside>

      {/* MOBILE SIDEBAR (optional toggle handled inside AdminSidebar) */}
      <aside className="md:hidden">
        <AdminSidebar />
      </aside>

      {/* RIGHT CONTENT */}
      <main
        className="
          flex-1
          overflow-y-auto
          px-4 sm:px-6 lg:px-8
          py-4 sm:py-6
        "
      >
        {/* CONTENT CONTAINER */}
        <div
          className="
            max-w-7xl mx-auto
          "
        >
          {children}
        </div>
      </main>
    </div>
  );
}
