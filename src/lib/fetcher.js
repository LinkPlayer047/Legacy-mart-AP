// lib/fetcher.js
export async function api(endpoint, options = {}) {
  const baseURL = "http://localhost:3001/"; // dev ke liye
  const res = await fetch(baseURL + endpoint, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "API request failed");
  }

  return res.json();
}
