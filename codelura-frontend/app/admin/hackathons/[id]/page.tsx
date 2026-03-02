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
  Spinner,
  TextInput,
  Textarea,
} from "flowbite-react";
import toast from "react-hot-toast";

type Hackathon = {
  _id?: string;
  id?: string;
  title?: string;
  shortDescription?: string;
  fullDescription?: string;
  bannerImageUrl?: string;
  registrationStartDate?: string;
  registrationEndDate?: string;
  hackathonStartDate?: string;
  hackathonEndDate?: string;
  prizePool?: number;
  maxTeamSize?: number;
  status?: string;
};

function isBlank(v: string) {
  return !v || !v.trim();
}

function toInputDate(value?: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export default function AdminHackathonDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);

  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    fullDescription: "",
    bannerImageUrl: "",
    registrationStartDate: "",
    registrationEndDate: "",
    hackathonStartDate: "",
    hackathonEndDate: "",
    prizePool: "",
    maxTeamSize: "",
  });

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    setError(null);

    api
      .get(normalizeApiPath(`/api/admin/hackathons/${id}`))
      .then((res) => {
        if (!mounted) return;
        const h: Hackathon = res.data?.hackathon || res.data;
        setHackathon(h);
        setForm({
          title: h.title || "",
          shortDescription: h.shortDescription || "",
          fullDescription: h.fullDescription || "",
          bannerImageUrl: h.bannerImageUrl || "",
          registrationStartDate: toInputDate(h.registrationStartDate),
          registrationEndDate: toInputDate(h.registrationEndDate),
          hackathonStartDate: toInputDate(h.hackathonStartDate),
          hackathonEndDate: toInputDate(h.hackathonEndDate),
          prizePool:
            typeof h.prizePool === "number" ? String(h.prizePool) : "",
          maxTeamSize:
            typeof h.maxTeamSize === "number" ? String(h.maxTeamSize) : "",
        });
      })
      .catch((err) => {
        console.error("ADMIN HACKATHON DETAILS ERROR 👉", err);
        if (!mounted) return;
        setError(
          err?.response?.data?.message || "Failed to load hackathon."
        );
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  const validation = useMemo(() => {
    const required = [
      form.title,
      form.shortDescription,
      form.fullDescription,
      form.registrationStartDate,
      form.registrationEndDate,
      form.hackathonStartDate,
      form.hackathonEndDate,
      form.prizePool,
      form.maxTeamSize,
    ];
    if (required.some(isBlank)) {
      return { ok: false, message: "Please fill all required fields." };
    }

    const regEnd = new Date(form.registrationEndDate).getTime();
    const hackStart = new Date(form.hackathonStartDate).getTime();
    const hackEnd = new Date(form.hackathonEndDate).getTime();

    if (Number.isNaN(regEnd) || Number.isNaN(hackStart) || Number.isNaN(hackEnd)) {
      return { ok: false, message: "Please provide valid dates." };
    }

    if (regEnd >= hackStart) {
      return {
        ok: false,
        message: "Registration end date must be before hackathon start date.",
      };
    }

    if (hackEnd <= hackStart) {
      return {
        ok: false,
        message: "Hackathon end date must be after hackathon start date.",
      };
    }

    const maxTeamSize = Number(form.maxTeamSize);
    if (!Number.isFinite(maxTeamSize) || maxTeamSize < 1 || maxTeamSize > 50) {
      return { ok: false, message: "Max team size must be between 1 and 50." };
    }

    const prize = Number(form.prizePool);
    if (!Number.isFinite(prize) || prize < 0) {
      return { ok: false, message: "Prize pool must be a valid number." };
    }

    return { ok: true, message: null as any };
  }, [form]);

  const save = async () => {
    setError(null);
    if (!validation.ok) {
      setError(validation.message);
      return;
    }

    try {
      setSaving(true);
      await api.put(normalizeApiPath(`/api/admin/hackathons/${id}`), {
        title: form.title.trim(),
        shortDescription: form.shortDescription.trim(),
        fullDescription: form.fullDescription.trim(),
        bannerImageUrl: form.bannerImageUrl.trim(),
        registrationStartDate: form.registrationStartDate,
        registrationEndDate: form.registrationEndDate,
        hackathonStartDate: form.hackathonStartDate,
        hackathonEndDate: form.hackathonEndDate,
        prizePool: Number(form.prizePool),
        maxTeamSize: Number(form.maxTeamSize),
      });

      toast.success("Hackathon updated.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">
            {hackathon?.title || "Hackathon"}
          </h1>
          <p className="text-sm text-gray-500">
            Edit hackathon configuration and review submissions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge color="indigo">{hackathon?.status || "—"}</Badge>
          <a href={`/admin/hackathons/${id}/submissions`}>
            <Button color="light">View Submissions</Button>
          </a>
        </div>
      </div>

      {error && <Alert color="failure">{error}</Alert>}

      <Card className="shadow-md">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Title *
            </label>
            <TextInput
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Short Description *
            </label>
            <Textarea
              rows={2}
              value={form.shortDescription}
              onChange={(e) =>
                setForm({ ...form, shortDescription: e.target.value })
              }
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Full Description *
            </label>
            <Textarea
              rows={6}
              value={form.fullDescription}
              onChange={(e) =>
                setForm({ ...form, fullDescription: e.target.value })
              }
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Banner Image URL
            </label>
            <TextInput
              value={form.bannerImageUrl}
              onChange={(e) =>
                setForm({ ...form, bannerImageUrl: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Registration Start Date *
            </label>
            <TextInput
              type="datetime-local"
              value={form.registrationStartDate}
              onChange={(e) =>
                setForm({ ...form, registrationStartDate: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Registration End Date *
            </label>
            <TextInput
              type="datetime-local"
              value={form.registrationEndDate}
              onChange={(e) =>
                setForm({ ...form, registrationEndDate: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Hackathon Start Date *
            </label>
            <TextInput
              type="datetime-local"
              value={form.hackathonStartDate}
              onChange={(e) =>
                setForm({ ...form, hackathonStartDate: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Hackathon End Date *
            </label>
            <TextInput
              type="datetime-local"
              value={form.hackathonEndDate}
              onChange={(e) =>
                setForm({ ...form, hackathonEndDate: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Prize Pool *
            </label>
            <TextInput
              type="number"
              min={0}
              value={form.prizePool}
              onChange={(e) =>
                setForm({ ...form, prizePool: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Max Team Size *
            </label>
            <TextInput
              type="number"
              min={1}
              max={50}
              value={form.maxTeamSize}
              onChange={(e) =>
                setForm({ ...form, maxTeamSize: e.target.value })
              }
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-3">
          <a href="/admin/hackathons">
            <Button color="light" disabled={saving}>
              Back
            </Button>
          </a>
          <Button color="purple" onClick={save} disabled={saving}>
            {saving ? (
              <span className="flex items-center gap-2">
                <Spinner size="sm" />
                Saving…
              </span>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}

