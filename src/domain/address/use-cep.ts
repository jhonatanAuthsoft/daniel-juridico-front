import { useQuery } from '@tanstack/react-query';

import { fetchAddressByCep, isValidCep, onlyDigits } from '@/data/address';

import { addressKeys } from './address.keys';

export type UseCepOptions = {
  enabled?: boolean;
};

/**
 * Domain hook: resolve address from CEP with TanStack Query cache.
 */
export function useCep(cep: string, options: UseCepOptions = {}) {
  const digits = onlyDigits(cep);
  const canFetch = isValidCep(digits) && (options.enabled ?? true);

  return useQuery({
    queryKey: addressKeys.cep(digits),
    queryFn: async ({ signal }) => {
      const address = await fetchAddressByCep(digits, signal);
      console.log('[useCep] address response', { cep: digits, address });
      return address;
    },
    enabled: canFetch,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    retry: false,
  });
}
