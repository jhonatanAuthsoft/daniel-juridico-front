import {
  buildSpecialtyId,
  type SpecialtyCategory,
} from '@/components/signup-lawyer/specialties.data';

import type {
  SpecialtyCatalogItem,
  SpecialtyCatalogWire,
} from './catalog.types';

export function mapSpecialtyCatalogWireToItem(
  item: SpecialtyCatalogWire,
): SpecialtyCatalogItem {
  return {
    code: item.codigo,
    name: item.nome,
    subspecialties: (item.subespecialidades ?? []).map((sub) => ({
      code: sub.codigo,
      name: sub.nome,
    })),
  };
}

/**
 * Maps API catalog items into the UI tree used by the lawyer signup step.
 * Child ids keep the `<SPECIALTY>:<SUB>` format expected by the register mapper.
 */
export function mapSpecialtyCatalogToCategories(
  items: SpecialtyCatalogItem[],
): SpecialtyCategory[] {
  return items.map((item) => ({
    id: item.code,
    code: item.code,
    label: item.name,
    children: item.subspecialties.map((sub) => ({
      id: buildSpecialtyId(item.code, sub.code),
      code: sub.code,
      label: sub.name,
    })),
  }));
}
