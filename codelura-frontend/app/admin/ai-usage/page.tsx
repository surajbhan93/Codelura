"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { normalizeApiPath } from "@/lib/apiPath";
import { Alert, Badge, Card, Spinner } from "flowbite-react";
import { Cpu, PieChart, ShieldCheck } from "lucide-react";

type UsageResponse = {
  totalAiCallsUsed?: number;
  callsRemaining?: number;
  breakdown?: {
    classification?: number;
    plagiarism?: number;
    judging?: number;
    feedback?: number;
  };
  modules?: Record<string, number>;
};

function asNumber(v: unknown) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function pickNumber(obj: unknown, keys: string[]) {
  if (!obj || typeof obj !== "object") return undefined;
  const rec = obj as Record<string, unknown>;
  for (const k of keys) {
    if (k in rec) {
      const n = Number(rec[k]);
      if (Number.isFinite(n)) return n;
    }
  }
  return undefined;
}

export default function AdminAiUsagePage() {
  const [data, setData] = useState<UsageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    api
      .get(normalizeApiPath("/api/admin/ai-usage"))
      .then((res) => {
        if (!mounted) return;
        setData(res.data);
      })
      .catch((err) => {
        console.error("ADMIN AI USAGE ERROR 👉", err);
        if (!mounted) return;
        setError(err?.response?.data?.message || "Failed to load AI usage.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const totalUsed = pickNumber(data, ["totalAiCallsUsed", "totalUsed", "used"]);
  const remaining = pickNumber(data, ["callsRemaining", "remaining", "left"]);

  const breakdown = useMemo(() => {
    const b = data?.breakdown || {};
    const modules = data?.modules || {};

    return {
      classification: asNumber(b.classification ?? modules.classification),
      plagiarism: asNumber(b.plagiarism ?? modules.plagiarism),
      judging: asNumber(b.judging ?? modules.judging),
      feedback: asNumber(b.feedback ?? modules.feedback),
    };
  }, [data]);

  const items = [
    { key: "Classification", value: breakdown.classification },
    { key: "Plagiarism", value: breakdown.plagiarism },
    { key: "Judging", value: breakdown.judging },
    { key: "Feedback", value: breakdown.feedback },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <Cpu className="text-indigo-600" />
          AI Usage Monitor
        </h1>
        <p className="text-sm text-gray-500">
          Track AI calls used and remaining, broken down by module.
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Spinner size="xl" />
        </div>
      )}

      {!loading && error && <Alert color="failure">{error}</Alert>}

      {!loading && !error && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Total AI Calls Used
                  </p>
                  <p className="text-2xl font-extrabold mt-1">
                    {totalUsed ?? "—"}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-white/10 flex items-center justify-center">
                  <PieChart className="text-indigo-600" size={18} />
                </div>
              </div>
            </Card>

            <Card className="shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Calls Remaining
                  </p>
                  <p className="text-2xl font-extrabold mt-1">
                    {remaining ?? "—"}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-white/10 flex items-center justify-center">
                  <ShieldCheck className="text-indigo-600" size={18} />
                </div>
              </div>
            </Card>

            <Card className="shadow-md">
              <p className="font-semibold">Policy</p>
              <p className="text-sm text-gray-500 mt-1">
                AI calls should be minimized and only used when rule-based
                checks are inconclusive.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge color="indigo">Low-cost</Badge>
                <Badge color="gray">Deterministic first</Badge>
              </div>
            </Card>
          </div>

          <Card className="shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold">Modules Breakdown</h2>
              <Badge color="indigo">Per module</Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((it) => (
                <div
                  key={it.key}
                  className="rounded-xl border border-gray-200 dark:border-white/10 p-4 bg-white/50 dark:bg-white/5"
                >
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    {it.key}
                  </p>
                  <p className="text-2xl font-extrabold mt-1">{it.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

