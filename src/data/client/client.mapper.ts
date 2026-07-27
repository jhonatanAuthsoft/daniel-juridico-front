import type { ClientSignupFormValues } from '@/components/signup-client';

import type {
  CadastrarClienteRequest,
  PronomesApi,
  TipoDocumentoApi,
} from './client.types';

/** Pending: replace with real uploaded asset URLs. */
export const MOCK_PHOTO_URL = 'https://mock-example.com';

function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

/**
 * Converts UI birth date (`DD/MM/YYYY` or digits) to API `YYYY-MM-DD`.
 */
export function toIsoBirthDate(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (isoMatch) {
    return trimmed;
  }

  const brMatch = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
  if (brMatch) {
    const [, day, month, year] = brMatch;
    return `${year}-${month}-${day}`;
  }

  const digits = onlyDigits(trimmed);
  if (digits.length === 8) {
    const day = digits.slice(0, 2);
    const month = digits.slice(2, 4);
    const year = digits.slice(4, 8);
    return `${year}-${month}-${day}`;
  }

  return undefined;
}

/**
 * Pending analysis: front pronouns → API enum.
 * `elu-delu` and `nao-informar` currently map to NEUTRO.
 */
export function mapPronounsToApi(value: string): PronomesApi {
  switch (value) {
    case 'ele-dele':
      return 'ELE';
    case 'ela-dela':
      return 'ELA';
    case 'elu-delu':
    case 'nao-informar':
    default:
      return 'NEUTRO';
  }
}

function mapPersonType(personType: ClientSignupFormValues['personType']): TipoDocumentoApi {
  return personType === 'cnpj' ? 'CNPJ' : 'CPF';
}

function formatCep(cep: string): string {
  const digits = onlyDigits(cep);
  if (digits.length !== 8) {
    return cep.trim();
  }
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

/**
 * Maps the client signup form into `POST /clientes/cadastrar` body.
 */
export function mapClientSignupFormToCadastrarRequest(
  form: ClientSignupFormValues,
): CadastrarClienteRequest {
  const tipoDocumento = mapPersonType(form.personType);
  const isCnpj = tipoDocumento === 'CNPJ';

  const base: CadastrarClienteRequest = {
    email: form.email.trim(),
    senha: form.password,
    tipoDocumento,
    numeroDocumento: onlyDigits(isCnpj ? form.cnpj : form.cpf),
    pronomes: mapPronounsToApi(form.pronouns),
    telefone: onlyDigits(form.phone),
    cep: formatCep(form.cep),
    logradouro: form.street.trim(),
    numero: form.number.trim(),
    complemento: form.complement.trim() || undefined,
    bairro: form.neighborhood.trim(),
    cidade: form.city.trim(),
    estado: form.state.trim().toUpperCase(),
    fotoUrl: MOCK_PHOTO_URL,
    faixaRenda: form.monthlyIncome.trim() || undefined,
    estadoCivil: form.maritalStatus.trim() || undefined,
  };

  if (isCnpj) {
    return {
      ...base,
      razaoSocial: form.fullName.trim(),
      areaAtuacao: form.businessArea.trim(),
      nomeCompleto: form.fullName.trim() || undefined,
    };
  }

  return {
    ...base,
    nomeCompleto: form.fullName.trim(),
    rg: form.rg.trim(),
    dataNascimento: toIsoBirthDate(form.birthDate),
    profissao: form.profession.trim(),
  };
}
