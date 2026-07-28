import {
  fetchSpecialtiesCatalog,
  mapSpecialtyCatalogToCategories,
  type SpecialtyCatalogItem,
} from '@/data/catalog';
import type { SpecialtyCategory } from '@/components/signup-lawyer/specialties.data';

/**
 * Use case: load specialties catalog and map to UI categories.
 */
export async function getSpecialtiesCatalogUseCase(
  signal?: AbortSignal,
): Promise<{
  items: SpecialtyCatalogItem[];
  categories: SpecialtyCategory[];
}> {
  const items = await fetchSpecialtiesCatalog(signal);
  return {
    items,
    categories: mapSpecialtyCatalogToCategories(items),
  };
}
