import { useCallback, useEffect, useMemo, useState } from 'react';

import { api } from '@/src/lib/api';
import {
  sortBusListings,
  type BusListing,
  type BusSortOption,
} from '@/src/lib/bus-search-data';
import type { BusSearchScope } from '@/src/types/bus';

export type BusFilters = {
  ac: boolean | null;
  sleeper: boolean | null;
  pickupTime: string[];
  dropoffTime: string[];
  operators: string[];
  minPrice: number | null;
  maxPrice: number | null;
};

type UseBusSearchResultsParams = {
  from: string;
  to: string;
  dateIso: string;
  scope: BusSearchScope;
  operatorId?: string;
};

export function useBusSearchResults({
  from,
  to,
  dateIso,
  scope,
  operatorId,
}: UseBusSearchResultsParams) {
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [allBuses, setAllBuses] = useState<BusListing[]>([]);
  const [sortBy, setSortBy] = useState<BusSortOption>('departure');
  const [filters, setFilters] = useState<BusFilters>({
    ac: null,
    sleeper: null,
    pickupTime: [],
    dropoffTime: [],
    operators: [],
    minPrice: null,
    maxPrice: null,
  });

  const reload = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await api.searchBuses({ from, to, date: dateIso, scope, operatorId });
      setAllBuses(result.listings);
      setFetchedAt(result.fetchedAt);
    } finally {
      setIsLoading(false);
    }
  }, [dateIso, from, operatorId, scope, to]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const uniqueOperators = useMemo(() => {
    const ops = new Set<string>();
    allBuses.forEach(b => ops.add(b.operator));
    return Array.from(ops);
  }, [allBuses]);

  const filteredBuses = useMemo(() => {
    return allBuses.filter((bus) => {
      if (filters.ac !== null && bus.isAc !== filters.ac) return false;
      if (filters.sleeper !== null && bus.isSleeper !== filters.sleeper) return false;
      if (filters.operators.length > 0 && !filters.operators.includes(bus.operator)) return false;
      if (filters.minPrice !== null && bus.price < filters.minPrice) return false;
      if (filters.maxPrice !== null && bus.price > filters.maxPrice) return false;
      return true;
    });
  }, [allBuses, filters]);

  const buses = useMemo(
    () => sortBusListings(filteredBuses, sortBy),
    [filteredBuses, sortBy],
  );

  const lowestFare = useMemo(
    () => (allBuses.length ? Math.min(...allBuses.map((bus) => bus.price)) : 0),
    [allBuses],
  );

  return {
    isLoading,
    fetchedAt,
    buses,
    lowestFare,
    sortBy,
    setSortBy,
    filters,
    setFilters,
    uniqueOperators,
    reload,
  };
}
