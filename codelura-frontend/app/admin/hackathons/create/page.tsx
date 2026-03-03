"use client";

import { useMemo, useState } from "react";
import api from "@/lib/api";
import { normalizeApiPath } from "@/lib/apiPath";
import {
  Alert,
  Button,
  Card,
  Spinner,
  TextInput,
  Textarea,
} from "flowbite-react";
import toast from "react-hot-toast";

type FormState = {
  title: string;
  shortDescription: string;
  fullDescription: string;
  bannerImageUrl: string;
  registrationStartDate: string;
  registrationEndDate: string;
  hackathonStartDate: string;
  hackathonEndDate: string;
  prizePool: string;
  maxTeamSize: string;
};

function isBlank(v: string) {
  return !v || !v.trim();
}

export default function CreateHackathonPage() {
  const [form, setForm] = useState<FormState>({
    title: "",
    shortDescription: "",
    fullDescription: "",
    bannerImageUrl: "",
    registrationStartDate: "",
    registrationEndDate: "",
    hackathonStartDate: "",
    hackathonEndDate: "",
    prizePool: "",
    maxTeamSize: "4",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validation = useMemo(() => {
    const requiredFields: Array<keyof FormState> = [
      "title",
      "shortDescription",
      "fullDescription",
      "registrationStartDate",
      "registrationEndDate",
      "hackathonStartDate",
      "hackathonEndDate",
      "prizePool",
      "maxTeamSize",
    ];

    for (const k of requiredFields) {
      if (isBlank(form[k])) {
        return { ok: false, message: "Please fill all required fields." };
      }
    }

    const regStart = new Date(form.registrationStartDate).getTime();
    const regEnd = new Date(form.registrationEndDate).getTime();
    const hackStart = new Date(form.hackathonStartDate).getTime();
    const hackEnd = new Date(form.hackathonEndDate).getTime();

    if (Number.isNaN(regStart) || Number.isNaN(regEnd) || Number.isNaN(hackStart) || Number.isNaN(hackEnd)) {
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

  const submit = async () => {
    setError(null);
    if (!validation.ok) {
      setError(validation.message);
      return;
    }

    try {
      setSubmitting(true);
      await api.post(normalizeApiPath("/api/admin/hackathons"), {
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

      toast.success("Hackathon created.");
      window.location.href = "/admin/hackathons";
    } catch (err: any) {
      setError(err?.response?.data?.message || "Create hackathon failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold">Create Hackathon</h1>
        <p className="text-sm text-gray-500">
          Create a new hackathon with correct registration and event dates.
        </p>
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
              placeholder="Hackathon title"
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
              placeholder="1–2 lines summary"
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
              placeholder="Detailed description and rules"
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
              placeholder="https://…"
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
              placeholder="e.g. 50000"
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
              placeholder="e.g. 4"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-3">
          <a href="/admin/hackathons">
            <Button color="light" disabled={submitting}>
              Cancel
            </Button>
          </a>
          <Button
            color="purple"
            onClick={submit}
            disabled={submitting}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Spinner size="sm" />
                Creating…
              </span>
            ) : (
              "Create Hackathon"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}

