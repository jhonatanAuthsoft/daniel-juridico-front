import { useQuery } from '@tanstack/react-query';

import { fetchCitiesByUf } from '@/data/address';

import { addressKeys } from './address.keys';

/**
 * Domain hook: cities (municípios) for a UF via BrasilAPI/IBGE.
 */
export function useCitiesByUf(uf: string) {
  const normalized = uf.trim().toUpperCase();
  const enabled = normalized.length === 2;

  return useQuery({
    queryKey: addressKeys.citiesByUf(normalized),
    queryFn: ({ signal }) => fetchCitiesByUf(normalized, signal),
    enabled,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7,
  });
}
