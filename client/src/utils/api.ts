const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;

  console.log("[apiFetch] →", url, options);

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  console.log("[apiFetch] status:", res.status);

  if (!res.ok) {
    const message = await res.text();
    console.error("[apiFetch] error response:", message);
    throw new Error(message || `API error: ${res.status}`);
  }

  const data = (await res.json()) as T;
  console.log("[apiFetch] response JSON:", data);
  return data;
}
