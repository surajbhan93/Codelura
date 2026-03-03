export function normalizeApiPath(path: string) {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  const baseEndsWithApi = /\/api\/?$/.test(base);

  if (baseEndsWithApi && path.startsWith("/api/")) {
    return path.replace(/^\/api/, "");
  }

  return path;
}

