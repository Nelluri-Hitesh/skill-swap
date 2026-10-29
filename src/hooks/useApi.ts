/**
 * useApi – Stale-While-Revalidate data fetching hook.
 *
 * 1. On mount: immediately hydrates from localStorage (no loading spinner shown to user).
 * 2. In background: fetches fresh data from the API and updates state + cache.
 *
 * This makes every page feel instant on repeat visits while still staying up-to-date.
 */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseApiOptions<T> {
  /** localStorage key to cache the data under */
  cacheKey: string;
  /** Default / fallback data when nothing is cached yet */
  fallback: T;
  /** Whether the fetch should be skipped entirely */
  skip?: boolean;
  /** Refresh interval in ms (0 = no auto-refresh) */
  refreshInterval?: number;
}

interface UseApiResult<T> {
  data: T;
  loading: boolean;   // true only on the very first load with NO cache at all
  refreshing: boolean; // true when fetching fresh data in background
  refetch: () => void;
}

export function useApi<T>(
  url: string | null,
  options: UseApiOptions<T>
): UseApiResult<T> {
  const { cacheKey, fallback, skip = false, refreshInterval = 0 } = options;

  // Immediately hydrate from cache (synchronous, zero-wait)
  const getCached = (): T => {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = localStorage.getItem(`skillswap_cache_${cacheKey}`);
      if (raw) return JSON.parse(raw) as T;
    } catch {
      // ignore parse errors
    }
    return fallback;
  };

  const [data, setData] = useState<T>(() => getCached());
  const [hasCached, setHasCached] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(`skillswap_cache_${cacheKey}`);
  });
  const [refreshing, setRefreshing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchData = useCallback(async () => {
    if (!url || skip) return;
    setRefreshing(true);
    try {
      const res = await fetch(url);
      if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) return;
      const json = await res.json();
      setData(json);
      setHasCached(true);
      try {
        localStorage.setItem(`skillswap_cache_${cacheKey}`, JSON.stringify(json));
      } catch {
        // storage full – just skip caching
      }
    } catch {
      // network error — cached data still shown
    } finally {
      setRefreshing(false);
    }
  }, [url, cacheKey, skip]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh polling (optional)
  useEffect(() => {
    if (!refreshInterval || refreshInterval <= 0) return;
    timerRef.current = setInterval(fetchData, refreshInterval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchData, refreshInterval]);

  return {
    data,
    loading: !hasCached && refreshing,
    refreshing,
    refetch: fetchData,
  };
}
