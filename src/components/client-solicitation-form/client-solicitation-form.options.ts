import type { SelectOption } from '@/constants/select-options';
import { SPECIALTY_CATEGORIES } from '@/components/signup-lawyer/specialties.data';

export const PRACTICE_OPTIONS: SelectOption[] = [
  { value: 'consultoria', label: 'Consultoria jurídica' },
  { value: 'processo', label: 'Processo judicial' },
  { value: 'mediacao', label: 'Mediação e acordo' },
];

export const SPECIALTY_OPTIONS: SelectOption[] = SPECIALTY_CATEGORIES.map((category) => ({
  value: category.id,
  label: category.label,
}));

export const SUBSPECIALTY_OPTIONS: SelectOption[] = SPECIALTY_CATEGORIES.flatMap(
  (category) =>
    category.children.map((specialty) => ({
      value: specialty.id,
      label: specialty.label,
    })),
);

export const URGENCY_OPTIONS: SelectOption[] = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Média' },
  { value: 'alta', label: 'Alta' },
  { value: 'imediata', label: 'Imediata' },
];

export const BILLING_OPTIONS: SelectOption[] = [
  { value: 'valor-fixo', label: 'Valor fixo' },
  { value: 'hora', label: 'Por hora' },
  { value: 'exito', label: 'Honorários de êxito' },
  { value: 'negociar', label: 'A combinar' },
];
