"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Spinner } from "flowbite-react";

type JwtPayload = {
  role?: string;
  exp?: number;
};

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(normalized)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    const parsed = JSON.parse(json) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const rec = parsed as Record<string, unknown>;
    return {
      role: typeof rec.role === "string" ? rec.role : undefined,
      exp: typeof rec.exp === "number" ? rec.exp : undefined,
    };
  } catch {
    return null;
  }
}

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("token");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedToken = window.localStorage.getItem("token");
    const storedRole = window.localStorage.getItem("role");

    if (!storedToken) {
      router.replace("/auth/login");
      return;
    }

    const payload = decodeJwtPayload(storedToken);
    const roleFromToken = payload?.role;
    const role = roleFromToken || storedRole;

    if (role !== "admin") {
      router.replace("/");
      return;
    }
  }, [router, pathname]);

  if (!token) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return <>{children}</>;
}

