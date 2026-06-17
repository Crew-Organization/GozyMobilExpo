import type { BusListing } from '@/src/lib/bus-search-data';

export type BusSearchScope = 'all' | 'govt';

export type BusSearchRequest = {
  from: string;
  to: string;
  date: string;
  scope?: BusSearchScope;
  operatorId?: string;
};

export type BusSearchResponse = {
  from: string;
  to: string;
  date: string;
  scope: BusSearchScope;
  fetchedAt: string;
  listings: BusListing[];
};
