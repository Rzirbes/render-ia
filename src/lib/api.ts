import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const headers = new Headers(init?.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}
