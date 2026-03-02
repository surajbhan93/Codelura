
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, Badge, Spinner, Alert } from "flowbite-react";
import { motion } from "framer-motion";
import {
  Activity,
  Cpu,
  FileText,
  Users,
  Trophy,
  AlertCircle
} from "lucide-react";
import { normalizeApiPath } from "@/lib/apiPath";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    api
      .get(normalizeApiPath("/api/admin/dashboard-stats"))
      .then((res) => {
        if (!mounted) return;
        setStats(res.data);
      })
      .catch((err) => {
        console.error("ADMIN DASHBOARD STATS ERROR 👉", err);
        if (!mounted) return;
        setError(
          err?.response?.data?.message ||
            "Failed to load dashboard stats."
        );
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const cards = [
    {
      label: "Total Hackathons",
      value: stats?.totalHackathons ?? "—",
      icon: Trophy
    },
    {
      label: "Total Participants",
      value: stats?.totalParticipants ?? "—",
      icon: Users
    },
    {
      label: "Total Submissions",
      value: stats?.totalSubmissions ?? "—",
      icon: FileText
    },
    {
      label: "AI Calls Used (Current)",
      value: stats?.aiCallsUsed ?? "—",
      icon: Cpu
    }
  ];

  const activeStatus =
    stats?.activeHackathonStatus ??
    stats?.activeHackathon?.status ??
    "—";

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
            <Activity className="text-indigo-600" />
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor hackathons, submissions, and AI usage.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <Badge color="indigo">Admin</Badge>
        </div>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Spinner size="xl" />
        </div>
      )}

      {!loading && error && (
        <Alert color="failure" icon={AlertCircle}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className="shadow-md hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        {c.label}
                      </p>
                      <p className="text-2xl font-extrabold mt-1">
                        {c.value}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-white/10 flex items-center justify-center">
                      <c.icon className="text-indigo-600" size={18} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full shadow-md">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Active Hackathon Status</p>
                  <Badge color={activeStatus === "ACTIVE" ? "success" : "gray"}>
                    {String(activeStatus)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {stats?.activeHackathon?.title
                    ? `Current: ${stats.activeHackathon.title}`
                    : "No active hackathon selected."}
                </p>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
            >
              <Card className="h-full shadow-md">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">AI Budget</p>
                  <Badge color="indigo">Monitor</Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Track usage across classification, plagiarism, judging, and
                  feedback modules.
                </p>
                <a
                  href="/admin/ai-usage"
                  className="mt-3 inline-flex text-sm font-semibold text-indigo-600 hover:underline"
                >
                  View AI usage →
                </a>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
            >
              <Card className="h-full shadow-md">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Quick Actions</p>
                  <Badge color="gray" icon={AlertCircle}>
                    Review
                  </Badge>
                </div>
                <div className="mt-3 flex flex-col gap-2 text-sm">
                  <a
                    href="/admin/hackathons"
                    className="text-indigo-600 hover:underline font-semibold"
                  >
                    Manage hackathons
                  </a>
                  <a
                    href="/admin/hackathons/create"
                    className="text-indigo-600 hover:underline font-semibold"
                  >
                    Create new hackathon
                  </a>
                </div>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
