"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
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
import { RefreshCcw, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";

type Submission = {
  _id?: string;
  id?: string;
  submissionId?: string;
  userName?: string;
  user?: { name?: string; email?: string };
  projectTitle?: string;
  classificationLevel?: string;
  plagiarismLevel?: string;
  ruleScore?: number;
  finalScore?: number;
  evaluationType?: string; // Rule / AI
  feedback?: string;
  flags?: string[];
};

function getSubmissionId(s: Submission) {
  return s.submissionId || s._id || s.id || "";
}

function badgeColor(level?: string) {
  const v = (level || "").toUpperCase();
  if (v === "HIGH") return "failure";
  if (v === "MEDIUM") return "warning";
  if (v === "LOW") return "success";
  return "gray";
}

export default function AdminHackathonSubmissionsPage() {
  const params = useParams<{ id: string }>();
  const hackathonId = params?.id;

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [classification, setClassification] = useState("ALL");
  const [plagiarism, setPlagiarism] = useState("ALL");

  const [page, setPage] = useState(1);
  const pageSize = 8;

  const fetchSubmissions = async () => {
    if (!hackathonId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await api.get(
        normalizeApiPath(`/api/admin/hackathons/${hackathonId}/submissions`)
      );
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.submissions;
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("ADMIN SUBMISSIONS ERROR 👉", err);
      setError(err?.response?.data?.message || "Failed to load submissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hackathonId]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return submissions.filter((s) => {
      const userName =
        (s.userName || s.user?.name || s.user?.email || "").toLowerCase();
      const title = (s.projectTitle || "").toLowerCase();
      const matchQuery = !query || userName.includes(query) || title.includes(query);

      const matchClass =
        classification === "ALL" ||
        (s.classificationLevel || "").toUpperCase() === classification;

      const matchPlag =
        plagiarism === "ALL" ||
        (s.plagiarismLevel || "").toUpperCase() === plagiarism;

      return matchQuery && matchClass && matchPlag;
    });
  }, [submissions, q, classification, plagiarism]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [q, classification, plagiarism]);

  const reEvaluate = async (submissionId: string) => {
    try {
      await api.post(normalizeApiPath("/api/admin/re-evaluate"), {
        submissionId,
        force: true,
      });
      toast.success("Re-evaluation triggered.");
      await fetchSubmissions();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Re-evaluate failed.");
    }
  };

  const publishResults = async () => {
    try {
      await api.post(normalizeApiPath("/api/admin/publish-results"), {
        hackathonId,
      });
      toast.success("Results published.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Publish failed.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Submissions Review</h1>
          <p className="text-sm text-gray-500">
            Review classification + plagiarism flags and trigger re-evaluation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a href={`/admin/hackathons/${hackathonId}`}>
            <Button color="light">Back to Hackathon</Button>
          </a>
          <Button color="purple" onClick={publishResults}>
            <UploadCloud size={16} className="mr-2" />
            Publish Results
          </Button>
        </div>
      </div>

      <Card className="shadow-md">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <TextInput
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by user or project title…"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 md:flex md:gap-3">
            <Select
              value={classification}
              onChange={(e) => setClassification(e.target.value)}
            >
              <option value="ALL">All classification</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </Select>
            <Select
              value={plagiarism}
              onChange={(e) => setPlagiarism(e.target.value)}
            >
              <option value="ALL">All plagiarism</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
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
          No submissions found.
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            {paged.map((s) => {
              const id = getSubmissionId(s);
              const user = s.userName || s.user?.name || s.user?.email || "—";
              return (
                <Card key={id} className="shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500">User</p>
                      <p className="font-semibold truncate">{user}</p>
                      <p className="text-sm text-gray-500 mt-2">Project</p>
                      <p className="font-semibold truncate">
                        {s.projectTitle || "—"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Badge color={badgeColor(s.classificationLevel)}>
                        Classification: {s.classificationLevel || "—"}
                      </Badge>
                      <Badge color={badgeColor(s.plagiarismLevel)}>
                        Plagiarism: {s.plagiarismLevel || "—"}
                      </Badge>
                      <Badge color="gray">
                        Eval: {s.evaluationType || "—"}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Rule Score</p>
                      <p className="font-semibold">{s.ruleScore ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Final Score</p>
                      <p className="font-semibold">{s.finalScore ?? "—"}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Feedback</p>
                    <p className="text-sm whitespace-pre-wrap">
                      {s.feedback || "—"}
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Flags</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(s.flags && s.flags.length > 0 ? s.flags : ["—"]).map(
                        (f) => (
                          <Badge key={f} color="indigo">
                            {f}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-end">
                    <Button
                      size="sm"
                      color="purple"
                      onClick={() => reEvaluate(id)}
                    >
                      <RefreshCcw size={14} className="mr-2" />
                      Re-evaluate
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

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
        </>
      )}
    </div>
  );
}

