export async function api(endpoint, options = {}) {
  const baseURL = "https://legacy-mart.vercel.app/";
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
