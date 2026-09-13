import { PasswordRequirements as PASSWORD_REQUIREMENTS } from '@/constants/password-requirements';

import type { ClientSignupFormValues } from './types';

export { PASSWORD_REQUIREMENTS };

export const TOTAL_STEPS = 5;

export const STEP_COPY: Record<number, { title: string; subtitle: string }> = {
  1: {
    title: 'Cadastre-se',
    subtitle: 'Seus dados são usados para validação e segurança da plataforma.',
  },
  2: {
    title: 'Cadastre-se',
    subtitle: 'Seus dados são usados para validação e segurança da plataforma.',
  },
  3: {
    title: 'Endereço',
    subtitle: 'Utilizamos sua localização para conectar você a advogados próximos.',
  },
  4: {
    title: 'Sobre Você',
    subtitle: 'Personalize seu perfil público e facilite conexão com advogados.',
  },
  5: {
    title: 'Sobre você',
    subtitle: 'Personalize seu perfil público e facilite conexão com advogados.',
  },
};

export function getClientSignupStepCopy(
  step: number,
  personType: ClientSignupFormValues['personType'],
): { title: string; subtitle: string } {
  if (step === 4 && personType === 'cnpj') {
    return {
      title: 'Sobre a Empresa',
      subtitle: 'Personalize seu perfil público e facilite conexão',
    };
  }
  return STEP_COPY[step] ?? STEP_COPY[1];
}

export const defaultValues: ClientSignupFormValues = {
  email: '',
  phone: '',
  password: '',
  personType: 'cpf',
  fullName: '',
  rg: '',
  issuingAuthority: '',
  uf: '',
  cpf: '',
  cnpj: '',
  businessArea: '',
  birthDate: '',
  cep: '',
  state: '',
  city: '',
  neighborhood: '',
  street: '',
  number: '',
  complement: '',
  maritalStatus: '',
  profession: '',
  monthlyIncome: '',
  pronouns: '',
  profileImageUri: '',
  profileImageKey: '',
};
