// (ONLY layout)
"use client";

// (ONLY layout)
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminGuard from "@/components/admin/AdminGuard";

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen flex bg-gray-50 dark:bg-[#0b0d17]">
        <AdminSidebar />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pt-16 md:pt-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </AdminGuard>
  );
}
