import { cookies } from "next/headers";
import { CurrentUser, MeResponse } from "../types/auth.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value ?? null;
}

export async function isAuthenticated() {
  const token = await getToken();
  return !!token;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token || !API_URL) return null;

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const data: MeResponse = await response.json();
  console.log("DATA /auth/me:", data);

  return data.user;
}
