"use client";

import useSWR from "swr";
import { listRendersService } from "../client/render.service";
import type { RenderItemList } from "../types/render.types";

type ListRendersResponse = {
  items: RenderItemList[];
  total: number;
  page: number;
  pageSize: number;
};

export function useRenders() {
  const { data, error, isLoading, mutate } = useSWR<ListRendersResponse>(
    "renders",
    () => listRendersService(),
  );

  return {
    renders: data?.items ?? [],
    totalRenders: data?.total ?? 0,
    pagination: {
      page: data?.page ?? 1,
      pageSize: data?.pageSize ?? 10,
    },
    isLoading,
    error,
    mutateRenders: mutate,
  };
}
