import type {
  LawyerSignupFormValues,
  SupplementalOabEntry,
} from '@/components/signup-lawyer/types';
import { parseSpecialtyId } from '@/components/signup-lawyer/specialties.data';
import { cityLabelFromValue } from '@/constants/select-options';
import { toIsoDate } from '@/data/shared';

import type {
  OabWireRequest,
  PostgraduateWireRequest,
  RegisterLawyerRequest,
  RegisterLawyerResult,
  RegisterLawyerWireResponse,
  SpecialtyWireRequest,
  TreatmentPronounApi,
} from './lawyer.types';

function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

function formatCep(cep: string): string {
  const digits = onlyDigits(cep);
  if (digits.length !== 8) {
    return cep.trim();
  }
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function toYear(value: string): number | undefined {
  const digits = onlyDigits(value);
  if (digits.length !== 4) {
    return undefined;
  }
  return Number(digits);
}

export function mapTreatmentPronounToApi(value: string): TreatmentPronounApi {
  const normalized = value.trim().toUpperCase();
  if (normalized === 'DOUTOR' || normalized === 'DOUTORA') {
    return normalized;
  }
  return 'NEUTRO';
}

const PRACTICE_AREA_TO_MODALIDADE: Record<string, string> = {
  pautista: 'PAUTISTA',
  generalista: 'GENERALISTA',
  consultor: 'CONSULTOR',
  correspondente: 'CORRESPONDENTE',
  none: 'NENHUMA_DAS_ANTERIORES',
};

export function mapPracticeAreaToModalidade(id: string): string {
  return PRACTICE_AREA_TO_MODALIDADE[id] ?? id.trim().toUpperCase();
}

const BILLING_TO_FORMA_COBRANCA: Record<string, string> = {
  contractual: 'HONORARIOS_CONTRATUAIS',
  percentage: 'HONORARIOS_PERCENTUAIS',
  court_awarded: 'HONORARIOS_ARBITRADOS',
  to_be_agreed: 'OUTROS_A_COMBINAR',
};

export function mapBillingMethodToApi(id: string): string {
  return BILLING_TO_FORMA_COBRANCA[id] ?? id.trim().toUpperCase();
}

export function mapSpecialtiesToApi(specialtyIds: string[]): SpecialtyWireRequest[] {
  return specialtyIds
    .map((id) => parseSpecialtyId(id))
    .filter((parsed): parsed is NonNullable<typeof parsed> => parsed != null)
    .map((parsed) => ({
      especialidadeCodigo: parsed.specialtyCode,
      subespecialidadeCodigo: parsed.subspecialtyCode,
    }));
}

function mapOab(
  numero: string,
  uf: string,
  issueDate: string,
  fotoFrenteKey: string,
  fotoVersoKey: string,
): OabWireRequest {
  return {
    numero: numero.trim(),
    uf: uf.trim().toUpperCase(),
    dataExpedicao: toIsoDate(issueDate) ?? '',
    fotoFrenteUrl: fotoFrenteKey.trim(),
    fotoVersoUrl: fotoVersoKey.trim(),
  };
}

function mapSupplementalOabs(entries: SupplementalOabEntry[]): OabWireRequest[] {
  return entries
    .filter((entry) => entry.number.trim())
    .map((entry) =>
      mapOab(entry.number, entry.uf, entry.issueDate, entry.frontKey, entry.backKey),
    );
}

function mapPostgraduates(
  entries: LawyerSignupFormValues['postgraduates'],
): PostgraduateWireRequest[] {
  return entries
    .filter((entry) => entry.course.trim())
    .map((entry) => ({
      nomeCurso: entry.course.trim(),
      instituicao: entry.university.trim(),
      anoFormacao: toYear(entry.year),
    }));
}

/**
 * Maps the lawyer signup form into `POST /advogados/cadastrar` wire body.
 * `atuacaoDesde` is derived from the primary OAB issue date (product decision).
 * Photo fields send S3 object keys from `/arquivos/url-upload`.
 */
export function mapLawyerSignupFormToRegisterRequest(
  form: LawyerSignupFormValues,
): RegisterLawyerRequest {
  const oabPrincipal = mapOab(
    form.oabNumber,
    form.oabUf,
    form.oabIssueDate,
    form.oabFrontKey,
    form.oabBackKey,
  );
  const supplementalOabs = mapSupplementalOabs(form.supplementalOabs);
  const fatherName = form.noFatherName ? '' : form.fatherName.trim();

  return {
    nomeCompleto: form.fullName.trim(),
    email: form.email.trim(),
    senha: form.password,
    rg: form.rg.trim(),
    rgOrgaoEmissor: form.issuingAuthority.trim(),
    rgUf: form.uf.trim().toUpperCase(),
    cpf: onlyDigits(form.cpf),
    nomePai: fatherName || undefined,
    nomeMae: form.motherName.trim(),
    pronomeTratamento: mapTreatmentPronounToApi(form.pronouns),
    telefone: onlyDigits(form.phone),
    fotoUrl: form.profileImageKey.trim(),
    universidade: form.university.trim(),
    curso: form.course.trim(),
    anoFormacao: toYear(form.graduationYear),
    atuacaoDesde: toIsoDate(form.oabIssueDate),
    biografia: form.biography.trim() || undefined,
    cep: formatCep(form.cep),
    logradouro: form.street.trim(),
    numero: form.number.trim(),
    complemento: form.complement.trim() || undefined,
    bairro: form.neighborhood.trim(),
    cidade: cityLabelFromValue(form.state, form.city),
    estado: form.state.trim().toUpperCase(),
    oabPrincipal,
    oabsSuplementares: supplementalOabs.length > 0 ? supplementalOabs : undefined,
    areasAtuacao: [
      {
        estado: form.serviceState.trim().toUpperCase(),
        cidade: cityLabelFromValue(form.serviceState, form.serviceCity),
      },
    ],
    modalidades: form.practiceAreas.map(mapPracticeAreaToModalidade),
    especialidades:
      form.specialties.length > 0 ? mapSpecialtiesToApi(form.specialties) : undefined,
    formasCobranca: form.billingMethods.map(mapBillingMethodToApi),
    posGraduacoes:
      form.postgraduates.length > 0 ? mapPostgraduates(form.postgraduates) : undefined,
  };
}

export function mapRegisterLawyerWireToResult(
  response: RegisterLawyerWireResponse,
): RegisterLawyerResult {
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
