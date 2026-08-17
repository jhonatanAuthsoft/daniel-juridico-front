import type { SelectOption } from '@/constants/select-options';
import type { SpecialtyCategory } from '@/components/signup-lawyer/specialties.data';

export const PRACTICE_OPTIONS: SelectOption[] = [
  { value: 'consultoria', label: 'Consultoria jurídica' },
  { value: 'processo', label: 'Processo judicial' },
  { value: 'mediacao', label: 'Mediação e acordo' },
];

export function specialtyOptionsFromCategories(
  categories: SpecialtyCategory[],
): SelectOption[] {
  return categories.map((category) => ({
    value: category.id,
    label: category.label,
  }));
}

export function subspecialtyOptionsFromCategories(
  categories: SpecialtyCategory[],
  specialtyCode?: string,
): SelectOption[] {
  const source = specialtyCode
    ? categories.filter((category) => category.id === specialtyCode)
    : categories;

  return source.flatMap((category) =>
    category.children.map((specialty) => ({
      value: specialty.id,
      label: specialty.label,
    })),
  );
}

export const URGENCY_OPTIONS: SelectOption[] = [
  { value: 'baixa', label: 'Tenho tempo' },
  { value: 'media', label: 'Médio' },
  { value: 'alta', label: 'Urgente' },
  { value: 'imediata', label: 'Emergência' },
];

export const BILLING_OPTIONS: SelectOption[] = [
  { value: 'valor-fixo', label: 'Valor fixo' },
  { value: 'hora', label: 'Por hora' },
  { value: 'exito', label: 'Honorários de êxito' },
  { value: 'negociar', label: 'A combinar' },
];
