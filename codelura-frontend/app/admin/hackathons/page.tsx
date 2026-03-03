"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { normalizeApiPath } from "@/lib/apiPath";
import {
  Alert,
  Badge,
  Button,
  Card,
  Pagination,
  Spinner,
  TextInput,
  Select,
} from "flowbite-react";
import { Search, Plus, Eye, Pencil, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";

type Hackathon = {
  _id?: string;
  id?: string;
  title?: string;
  status?: string;
  participantsCount?: number;
  submissionsCount?: number;
  startDate?: string;
  endDate?: string;
};

function getId(h: Hackathon) {
  return h._id || h.id || "";
}

function statusColor(status?: string) {
  const s = (status || "").toUpperCase();
  if (s.includes("ACTIVE")) return "success";
  if (s.includes("PUBLISH")) return "purple";
  if (s.includes("END") || s.includes("CLOSE")) return "failure";
  if (s.includes("DRAFT")) return "gray";
  return "indigo";
}

export default function AdminHackathonsPage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("ALL");

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return hackathons.filter((h) => {
      const title = (h.title || "").toLowerCase();
      const statusMatch =
        status === "ALL" ||
        (h.status || "").toUpperCase() === status.toUpperCase();
      const queryMatch = !query || title.includes(query);
      return statusMatch && queryMatch;
    });
  }, [hackathons, q, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    api
      .get(normalizeApiPath("/api/admin/hackathons"))
      .then((res) => {
        if (!mounted) return;
        const data = Array.isArray(res.data) ? res.data : res.data?.hackathons;
        setHackathons(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("ADMIN HACKATHONS ERROR 👉", err);
        if (!mounted) return;
        setError(err?.response?.data?.message || "Failed to load hackathons.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [q, status]);

  const publishResults = async (hackathonId: string) => {
    try {
      await api.post(normalizeApiPath("/api/admin/publish-results"), {
        hackathonId,
      });
      toast.success("Results published.");
      setHackathons((prev) =>
        prev.map((h) =>
          getId(h) === hackathonId
            ? { ...h, status: h.status || "PUBLISHED" }
            : h
        )
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Publish failed.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Hackathons</h1>
          <p className="text-sm text-gray-500">
            Create, edit, review submissions, and publish results.
          </p>
        </div>

        <a href="/admin/hackathons/create">
          <Button color="purple">
            <Plus size={16} className="mr-2" />
            Create Hackathon
          </Button>
        </a>
      </div>

      <Card className="shadow-md">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <TextInput
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by title…"
            />
          </div>

          <div className="w-full md:w-56">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="ALL">All statuses</option>
              <option value="DRAFT">DRAFT</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="ENDED">ENDED</option>
              <option value="PUBLISHED">PUBLISHED</option>
            </Select>
          </div>
        </div>
      </Card>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Spinner size="xl" />
        </div>
      )}

      {!loading && error && <Alert color="failure">{error}</Alert>}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          No hackathons found.
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <Card className="shadow-md overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs uppercase tracking-wide text-gray-500 border-b border-gray-200 dark:border-white/10">
              <tr>
                <th className="text-left py-3 pr-4">Title</th>
                <th className="text-left py-3 pr-4">Status</th>
                <th className="text-left py-3 pr-4">Participants</th>
                <th className="text-left py-3 pr-4">Submissions</th>
                <th className="text-left py-3 pr-4">Start</th>
                <th className="text-left py-3 pr-4">End</th>
                <th className="text-left py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
              {paged.map((h) => {
                const id = getId(h);
                return (
                  <tr key={id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                    <td className="py-3 pr-4 font-semibold">{h.title || "Untitled"}</td>
                    <td className="py-3 pr-4">
                      <Badge color={statusColor(h.status)}>
                        {(h.status || "—").toString()}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4">{h.participantsCount ?? "—"}</td>
                    <td className="py-3 pr-4">{h.submissionsCount ?? "—"}</td>
                    <td className="py-3 pr-4">
                      {h.startDate ? new Date(h.startDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-3 pr-4">
                      {h.endDate ? new Date(h.endDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        <a href={`/admin/hackathons/${id}`}>
                          <Button size="xs" color="light">
                            <Pencil size={14} className="mr-1" />
                            Edit
                          </Button>
                        </a>
                        <a href={`/admin/hackathons/${id}/submissions`}>
                          <Button size="xs" color="light">
                            <Eye size={14} className="mr-1" />
                            Submissions
                          </Button>
                        </a>
                        <Button
                          size="xs"
                          color="purple"
                          onClick={() => publishResults(id)}
                        >
                          <UploadCloud size={14} className="mr-1" />
                          Publish Results
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Showing {(page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, filtered.length)} of {filtered.length}
            </p>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              showIcons
            />
          </div>
        </Card>
      )}
    </div>
  );
}

