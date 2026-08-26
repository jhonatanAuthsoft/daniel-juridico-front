import { MARITAL_STATUS_OPTIONS } from '@/constants/select-options';
import type { ClientEditProfile } from '@/data/auth';

export function formatAddressSummary(input: Pick<
  ClientEditProfile,
  'street' | 'neighborhood' | 'city' | 'state'
>): string {
  const street = input.street.trim();
  const neighborhood = input.neighborhood.trim();
  const city = input.city.trim();
  const state = input.state.trim().toUpperCase();
  const locality = [city, state].filter(Boolean).join(' - ');
  return [street, neighborhood, locality].filter(Boolean).join(', ');
}

export function formatPersonalSummary(input: Pick<
  ClientEditProfile,
  'monthlyIncome' | 'profession' | 'maritalStatus'
>): string {
  const income = input.monthlyIncome.trim();
  const incomeLabel = income ? `R$ ${income.replace(/^R\$\s*/i, '')}` : '';
  const profession = input.profession.trim();
  const marital =
    MARITAL_STATUS_OPTIONS.find((option) => option.value === input.maritalStatus)
      ?.label ?? '';
  return [incomeLabel, profession, marital].filter(Boolean).join(', ');
}
