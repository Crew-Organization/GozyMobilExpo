import { useCallback, useEffect, useMemo, useState } from 'react';

import { api } from '@/src/lib/api';
import {
  filterBusListings,
  sortBusListings,
  type BusFilterOption,
  type BusListing,
  type BusSortOption,
} from '@/src/lib/bus-search-data';
import type { BusSearchScope } from '@/src/types/bus';

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
  const [filterBy, setFilterBy] = useState<BusFilterOption>('all');

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

  const buses = useMemo(
    () => sortBusListings(filterBusListings(allBuses, filterBy), sortBy),
    [allBuses, filterBy, sortBy],
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
    filterBy,
    setFilterBy,
    reload,
  };
}
