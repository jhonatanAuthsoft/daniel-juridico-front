import { PasswordRequirements as PASSWORD_REQUIREMENTS } from '@/constants/password-requirements';

import type { LawyerSignupFormValues } from './types';

export { PASSWORD_REQUIREMENTS };

export const TOTAL_STEPS = 10;

export const STEP_COPY: Record<number, { title: string; subtitle: string }> = {
  1: {
    title: 'Dados básicos',
    subtitle: 'Seus dados são usados para validação e segurança da plataforma.',
  },
  2: {
    title: 'Documentação',
    subtitle: 'Seus dados são usados para validação e segurança da plataforma.',
  },
  3: {
    title: 'Endereço',
    subtitle:
      'Utilizamos sua localização para conectar você a clientes próximos. Seus dados são exibidos de forma segura, apenas bairro, cidade e estado ficam visíveis para os clientes.',
  },
  4: {
    title: 'Registro OAB',
    subtitle: 'Utilizamos essa informação para validar seu registro profissional junto à OAB.',
  },
  5: {
    title: 'Formação',
    subtitle: 'Ajude os clientes a conhecer sua trajetória acadêmica.',
  },
  6: {
    title: 'Atuação',
    subtitle:
      'Selecione sua área de atuação para receber solicitações alinhadas ao seu perfil profissional.',
  },
  7: {
    title: 'Etapa 7',
    subtitle: 'Em breve.',
  },
  8: {
    title: 'Especialidades',
    subtitle: 'Escolha suas especialidades para receber demandas compatíveis.',
  },
  9: {
    title: 'Cobrança',
    subtitle: 'Escolha as formas de cobrança que você utiliza.',
  },
  10: {
    title: 'Sobre você',
    subtitle: 'Personalize seu perfil público e facilite para que os clientes encontrem você.',
  },
};

export const defaultValues: LawyerSignupFormValues = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  motherName: '',
  fatherName: '',
  noFatherName: false,
  rg: '',
  issuingAuthority: '',
  uf: '',
  cpf: '',
  cep: '',
  state: '',
  city: '',
  neighborhood: '',
  street: '',
  number: '',
  complement: '',
  oabNumber: '',
  oabUf: '',
  oabFrontUri: '',
  oabBackUri: '',
  supplementalOabNumber: '',
  supplementalOabUf: '',
  supplementalOabFrontUri: '',
  supplementalOabBackUri: '',
  university: '',
  course: '',
  graduationYear: '',
  postgraduateUniversity: '',
  postgraduateCourse: '',
  postgraduateYear: '',
  practiceAreas: [],
  specialties: [],
  billingMethods: [],
  pronouns: '',
  profileImageUri: '',
  biography: '',
};
