/**
 * Specialty UI types + id helpers.
 * Catalog data comes from `GET /catalogos/especialidades` via `useSpecialtiesCatalog`.
 *
 * Selected child ids are `<SPECIALTY_CODE>:<SUBSPECIALTY_CODE>` so the
 * API mapper can derive both codes without extra lookups.
 */

export type SpecialtyChild = {
  id: string;
  code: string;
  label: string;
};

export type SpecialtyCategory = {
  id: string;
  code: string;
  label: string;
  children: SpecialtyChild[];
};

export const SPECIALTY_ID_SEPARATOR = ':';

export function buildSpecialtyId(categoryCode: string, childCode: string): string {
  return `${categoryCode}${SPECIALTY_ID_SEPARATOR}${childCode}`;
}

export function parseSpecialtyId(
  id: string,
): { specialtyCode: string; subspecialtyCode: string } | null {
  const [specialtyCode, subspecialtyCode] = id.split(SPECIALTY_ID_SEPARATOR);
  if (!specialtyCode || !subspecialtyCode) {
    return null;
  }
  return { specialtyCode, subspecialtyCode };
}
