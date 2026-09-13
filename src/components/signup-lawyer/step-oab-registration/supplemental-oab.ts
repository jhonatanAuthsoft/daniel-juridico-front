import { FieldValidators } from '@/constants/field-validators';

import type { SupplementalOabEntry } from '../types';

export type SupplementalOabLike = Pick<
  SupplementalOabEntry,
  'number' | 'uf' | 'issueDate'
> & {
  photoKeys?: string[];
  photoUris?: string[];
};

function filledPhotoCount(entry: SupplementalOabLike): number {
  const keys = (entry.photoKeys ?? []).filter((value) => value.trim());
  if (keys.length > 0) {
    return keys.length;
  }
  return (entry.photoUris ?? []).filter((value) => value.trim()).length;
}

export function hasSupplementalOabPhotos(entry: SupplementalOabLike): boolean {
  return filledPhotoCount(entry) >= 2;
}

export function isCompleteSupplementalOab(entry: SupplementalOabLike): boolean {
  const numberOk =
    FieldValidators.alphanumericMin(3, 'Número da OAB inválido')(entry.number) ===
    true;
  const ufOk = entry.uf.trim().length === 2;
  const dateOk = FieldValidators.dateBrOabIssue(entry.issueDate) === true;
  return numberOk && ufOk && dateOk && hasSupplementalOabPhotos(entry);
}

export function hasFilledSupplementalOabDraft(entry: SupplementalOabLike): boolean {
  return Boolean(
    entry.number.trim() ||
      entry.uf.trim() ||
      entry.issueDate.trim() ||
      filledPhotoCount(entry) > 0,
  );
}

export function keepCompleteSupplementalOabs<T extends SupplementalOabLike>(
  entries: T[],
): T[] {
  return entries.filter(isCompleteSupplementalOab);
}
