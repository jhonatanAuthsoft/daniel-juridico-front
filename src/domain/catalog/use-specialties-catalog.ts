import { useQuery } from '@tanstack/react-query';

import { catalogKeys } from './catalog.keys';
import { getSpecialtiesCatalogUseCase } from './get-specialties-catalog.use-case';

/**
 * Domain hook: specialties catalog from `GET /catalogos/especialidades`.
 */
export function useSpecialtiesCatalog() {
  return useQuery({
    queryKey: catalogKeys.specialties(),
    queryFn: ({ signal }) => getSpecialtiesCatalogUseCase(signal),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60 * 24,
  });
}
