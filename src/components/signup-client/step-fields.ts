import type { FieldPath } from 'react-hook-form';

import type { ClientSignupFormValues } from './types';

export function getClientSignupStepFields(
  step: number,
  personType: ClientSignupFormValues['personType'],
): FieldPath<ClientSignupFormValues>[] {
  switch (step) {
    case 1:
      return ['email', 'phone', 'password'];
    case 2:
      if (personType === 'cnpj') {
        return ['fullName', 'cnpj', 'businessArea'];
      }
      return [
        'fullName',
        'rg',
        'issuingAuthority',
        'uf',
        'cpf',
        'birthDate',
      ];
    case 3:
      return ['cep', 'state', 'city', 'neighborhood', 'street', 'number'];
    case 4:
      return ['maritalStatus', 'profession', 'monthlyIncome'];
    case 5:
      return ['pronouns'];
    default:
      return [];
  }
}
