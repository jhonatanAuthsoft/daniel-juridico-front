import {
  apiUrl,
  assertApiSuccess,
  httpRequest,
  type ApiResponse,
} from '@/data/http';

import { mapSpecialtyCatalogWireToItem } from './catalog.mapper';
import type {
  SpecialtyCatalogItem,
  SpecialtyCatalogWire,
} from './catalog.types';

/**
 * Lists specialties + subspecialties from the server catalog.
 * `GET /catalogos/especialidades` (public)
 */
export async function fetchSpecialtiesCatalog(
  signal?: AbortSignal,
): Promise<SpecialtyCatalogItem[]> {
  const response = await httpRequest<ApiResponse<SpecialtyCatalogWire[]>>(
    apiUrl('/catalogos/especialidades'),
    {
      method: 'GET',
      signal,
    },
  );

  const data = assertApiSuccess(response, 'Falha ao carregar especialidades.');
  return data.map(mapSpecialtyCatalogWireToItem);
}
