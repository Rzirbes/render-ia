"use client";

import useSWR from "swr";
import type { MeResponse } from "../types/auth.types";

const fetcher = async (url: string): Promise<MeResponse> => {
  const res = await fetch(url, {
    credentials: "include",
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Erro ao buscar usuário");
  }

  return data;
};

export function useCurrentUser() {
  const { data, error, isLoading, mutate } = useSWR<MeResponse>(
    "/api/auth/me",
    fetcher,
  );

  return {
    user: data?.user ?? null,
    isLoading,
    error,
    mutateUser: mutate,
  };
}
