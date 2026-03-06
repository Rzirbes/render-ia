import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value ?? null;
}

export async function isAuthenticated() {
  const token = await getToken();
  return !!token;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return null;

  return response.json();
}
