const BASE = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(url: string, opts: RequestInit = {}) {
  const res = await fetch(String(BASE) + url, {
    headers: { "Content-Type": "application/json", ...(opts.headers ?? {}) },
    ...opts,
  });
  if (!res.ok) throw new Error("API Error");
  return res.json();
}

export async function authFetch(url: string, opts: RequestInit = {}) {
  const token = localStorage.getItem("token");
  return apiFetch(url, {
    ...opts,
    headers: {
      ...(opts.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  });
}
