import type { ClientSignupFormValues } from '@/components/signup-client';
import { cityLabelFromValue } from '@/constants/select-options';
import { MOCK_PHOTO_URL, toIsoDate } from '@/data/shared';

import type {
  DocumentTypeApi,
  PronounsApi,
  RegisterClientRequest,
  RegisterClientResult,
  RegisterClientWireResponse,
} from './client.types';

export { MOCK_PHOTO_URL };

function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

/**
 * Converts UI birth date (`DD/MM/YYYY` or digits) to API `YYYY-MM-DD`.
 */
export function toIsoBirthDate(value: string): string | undefined {
  return toIsoDate(value);
}

/**
 * Pending analysis: front pronouns → API enum.
 * `elu-delu` and `nao-informar` currently map to NEUTRO.
 */
export function mapPronounsToApi(value: string): PronounsApi {
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

function mapPersonType(personType: ClientSignupFormValues['personType']): DocumentTypeApi {
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
 * Maps the client signup form into `POST /clientes/cadastrar` wire body.
 */
export function mapClientSignupFormToRegisterRequest(
  form: ClientSignupFormValues,
): RegisterClientRequest {
  const documentType = mapPersonType(form.personType);
  const isCnpj = documentType === 'CNPJ';

  const base: RegisterClientRequest = {
    email: form.email.trim(),
    senha: form.password,
    tipoDocumento: documentType,
    numeroDocumento: onlyDigits(isCnpj ? form.cnpj : form.cpf),
    pronomes: mapPronounsToApi(form.pronouns),
    telefone: onlyDigits(form.phone),
    cep: formatCep(form.cep),
    logradouro: form.street.trim(),
    numero: form.number.trim(),
    complemento: form.complement.trim() || undefined,
    bairro: form.neighborhood.trim(),
    cidade: cityLabelFromValue(form.state, form.city.trim()),
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

export function mapRegisterClientWireToResult(
  response: RegisterClientWireResponse,
): RegisterClientResult {
  return {
    token: response.token,
    refreshToken: response.refreshToken,
    user: {
      id: response.usuario.id,
      email: response.usuario.email,
      fullName: response.usuario.nomeCompleto,
      profile: response.usuario.perfil,
      phone: response.usuario.telefone,
      termsAccepted: Boolean(response.usuario.termosAceitos),
    },
    raw: response,
  };
}
