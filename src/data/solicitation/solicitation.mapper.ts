import type { ClientSolicitationCardData, SolicitationWorkflowStatus } from '@/components/client-solicitation-card';
import type { CompatibleLawyer } from '@/components/client-solicitation-details/mock-client-solicitation-details';
import { parseSpecialtyId } from '@/components/signup-lawyer/specialties.data';
import { cityLabelFromValue } from '@/constants/select-options';
import { BrandColors } from '@/constants/theme';

import type {
  CreateSolicitationParams,
  CreateSolicitationResult,
  CreateSolicitationWireRequest,
  CreateSolicitationWireResponse,
  FormaCobrancaSolicitacaoApi,
  ModalidadeSolicitacaoApi,
  NivelLocalidadeApi,
  SolicitationDetailResult,
  SolicitationMatchResult,
  SolicitationStatusCounts,
  SolicitacaoDetalheWire,
  SolicitacaoListagemItemWire,
  SolicitacaoListagemWire,
  SolicitacaoMatchWire,
  StatusSolicitacaoApi,
  UrgenciaSolicitacaoApi,
} from './solicitation.types';

const PRACTICE_TO_MODALIDADE: Record<string, ModalidadeSolicitacaoApi> = {
  consultoria: 'CONSULTORIA',
  processo: 'PROCESSO',
  mediacao: 'MEDIACAO',
  CONSULTORIA: 'CONSULTORIA',
  PROCESSO: 'PROCESSO',
  MEDIACAO: 'MEDIACAO',
};

const URGENCY_TO_API: Record<string, UrgenciaSolicitacaoApi> = {
  baixa: 'TENHO_TEMPO',
  media: 'MEDIO',
  alta: 'URGENTE',
  imediata: 'EMERGENCIA',
  TENHO_TEMPO: 'TENHO_TEMPO',
  MEDIO: 'MEDIO',
  URGENTE: 'URGENTE',
  EMERGENCIA: 'EMERGENCIA',
};

const BILLING_TO_API: Record<string, FormaCobrancaSolicitacaoApi> = {
  'valor-fixo': 'VALOR_FIXO',
  hora: 'HORA',
  exito: 'EXITO',
  negociar: 'NEGOCIAR',
  VALOR_FIXO: 'VALOR_FIXO',
  HORA: 'HORA',
  EXITO: 'EXITO',
  NEGOCIAR: 'NEGOCIAR',
};

const URGENCY_TO_STATUS: Record<UrgenciaSolicitacaoApi, SolicitationStatus> = {
  EMERGENCIA: 'emergencia',
  URGENTE: 'urgente',
  MEDIO: 'medio',
  TENHO_TEMPO: 'tenho_tempo',
};

const MODALIDADE_LABEL: Record<ModalidadeSolicitacaoApi, string> = {
  CONSULTORIA: 'Consultoria',
  PROCESSO: 'Processo',
  MEDIACAO: 'Mediação',
};

const BILLING_LABEL: Record<FormaCobrancaSolicitacaoApi, string> = {
  VALOR_FIXO: 'Valor fixo',
  HORA: 'Por hora',
  EXITO: 'Êxito',
  NEGOCIAR: 'A combinar',
};

const LOCALITY_LABEL: Record<NivelLocalidadeApi, string> = {
  MESMA_CIDADE: 'Mesma cidade',
  MESMO_ESTADO: 'Mesmo estado',
  FORA_ESTADO: 'Outro estado',
};

const EMPTY_STATUS_COUNTS: SolicitationStatusCounts = {
  AGUARDANDO_MATCHING: 0,
  MATCH_REALIZADO: 0,
  CANCELADA: 0,
};

function mapFooterVariant(
  status: StatusSolicitacaoApi,
): ClientSolicitationCardData['footerVariant'] {
  if (status === 'MATCH_REALIZADO') {
    return 'accepted';
  }
  return 'compatible';
}

export function mapContagemPorStatus(
  contagem: Partial<Record<StatusSolicitacaoApi, number>> | null | undefined,
): SolicitationStatusCounts {
  return {
    AGUARDANDO_MATCHING: Number(contagem?.AGUARDANDO_MATCHING ?? 0),
    MATCH_REALIZADO: Number(contagem?.MATCH_REALIZADO ?? 0),
    CANCELADA: Number(contagem?.CANCELADA ?? 0),
  };
}

/** Cancel is allowed only while waiting for a lawyer accept (`AGUARDANDO_MATCHING`). */
export function canCancelSolicitationStatus(
  status: StatusSolicitacaoApi | string | undefined,
): boolean {
  return status === 'AGUARDANDO_MATCHING';
}

export function emptySolicitationStatusCounts(): SolicitationStatusCounts {
  return { ...EMPTY_STATUS_COUNTS };
}

const AVATAR_COLORS = [
  BrandColors.primary.medium,
  '#7A5C58',
  '#8A6D5B',
  '#626B73',
  '#8A3345',
];

function mapModalidade(value: string): ModalidadeSolicitacaoApi {
  const mapped = PRACTICE_TO_MODALIDADE[value.trim()];
  if (!mapped) {
    throw new Error('Modalidade de atuação inválida.');
  }
  return mapped;
}

function mapUrgencia(value: string): UrgenciaSolicitacaoApi {
  const mapped = URGENCY_TO_API[value.trim()];
  if (!mapped) {
    throw new Error('Grau de urgência inválido.');
  }
  return mapped;
}

function mapFormaCobranca(
  value: string | undefined,
): FormaCobrancaSolicitacaoApi | undefined {
  const trimmed = value?.trim();
  if (!trimmed) {
    return undefined;
  }
  return BILLING_TO_API[trimmed];
}

function resolveSubspecialtyCode(
  specialtyCode: string,
  subspecialty: string | undefined,
): string | undefined {
  const raw = subspecialty?.trim();
  if (!raw) {
    return undefined;
  }
  const parsed = parseSpecialtyId(raw);
  if (parsed) {
    return parsed.subspecialtyCode;
  }
  if (raw.startsWith(`${specialtyCode}:`)) {
    return raw.slice(specialtyCode.length + 1) || undefined;
  }
  return raw;
}

export function mapUrgenciaToStatus(
  urgencia: UrgenciaSolicitacaoApi,
): SolicitationStatus {
  return URGENCY_TO_STATUS[urgencia] ?? 'medio';
}

export function mapModalidadeLabel(modalidade: ModalidadeSolicitacaoApi): string {
  return MODALIDADE_LABEL[modalidade] ?? modalidade;
}

export function mapFormaCobrancaLabel(
  forma: FormaCobrancaSolicitacaoApi | null | undefined,
): string {
  if (!forma) {
    return 'Não informado';
  }
  return BILLING_LABEL[forma] ?? forma;
}

export function mapLocalidadeLabel(nivel: NivelLocalidadeApi): string {
  return LOCALITY_LABEL[nivel] ?? nivel;
}

/** Formats ISO / LocalDateTime string as dd/MM/yyyy. */
export function formatSolicitationDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return `${match[3]}/${match[2]}/${match[1]}`;
    }
    return value;
  }
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return 'AD';
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
}

function formatRating(value: number | null | undefined): string {
  if (value == null || Number.isNaN(Number(value))) {
    return '—';
  }
  return Number(value).toFixed(1).replace('.', ',');
}

export function mapCreateSolicitationParamsToWire(
  params: CreateSolicitationParams,
): CreateSolicitationWireRequest {
  const specialtyCode = params.specialty.trim().toUpperCase();
  const experienceRaw = params.minimumExperienceMonths?.trim() ?? '';
  const experienceMonths =
    experienceRaw.length > 0 ? Number(experienceRaw) : undefined;

  const body: CreateSolicitationWireRequest = {
    titulo: params.title.trim(),
    modalidade: mapModalidade(params.practice),
    especialidadeCodigo: specialtyCode,
    uf: params.state.trim().toUpperCase(),
    cidade: cityLabelFromValue(params.state, params.city),
    urgencia: mapUrgencia(params.urgency),
    descricao: params.problem.trim(),
  };

  const subCode = resolveSubspecialtyCode(specialtyCode, params.subspecialty);
  if (subCode) {
    body.subespecialidadeCodigo = subCode;
  }

  const formaCobranca = mapFormaCobranca(params.billingMethod);
  if (formaCobranca) {
    body.formaCobranca = formaCobranca;
  }

  if (
    experienceMonths != null &&
    Number.isFinite(experienceMonths) &&
    experienceMonths >= 0
  ) {
    body.experienciaMinimaMeses = experienceMonths;
  }

  return body;
}

export function mapCreateSolicitationWireToResult(
  response: CreateSolicitationWireResponse,
): CreateSolicitationResult {
  return {
    id: String(response.id),
    status: response.status,
    title: response.titulo,
    totalMatches: response.totalMatches ?? 0,
    createdAt: response.criadoEm,
  };
}

export function mapListItemWireToCard(
  item: SolicitacaoListagemItemWire,
): ClientSolicitationCardData {
  const workflowStatus = (item.status ?? 'AGUARDANDO_MATCHING') as SolicitationWorkflowStatus;
  const footerVariant = mapFooterVariant(workflowStatus);
  const lawyerCount =
    footerVariant === 'accepted'
      ? Number(item.totalConexoesAceitas ?? 0)
      : Number(item.totalMatches ?? 0);

  return {
    id: String(item.id),
    status: mapUrgenciaToStatus(item.urgencia),
    workflowStatus,
    title: item.titulo,
    description: item.descricao,
    date: formatSolicitationDate(item.dataAbertura),
    lawyerCount,
    footerVariant,
  };
}

export function mapListagemWireToResult(
  wire: SolicitacaoListagemWire,
  totalElements: number,
): {
  items: ClientSolicitationCardData[];
  totalElements: number;
  countsByStatus: SolicitationStatusCounts;
} {
  return {
    items: (wire.items ?? []).map(mapListItemWireToCard),
    totalElements,
    countsByStatus: mapContagemPorStatus(wire.contagemPorStatus),
  };
}

/**
 * Normalizes list payload from the API.
 * New shape: `{ items, contagemPorStatus }`.
 * Legacy shape: bare `SolicitacaoListagemItemWire[]`.
 */
export function normalizeListagemPayload(
  data: SolicitacaoListagemWire | SolicitacaoListagemItemWire[] | null | undefined,
): SolicitacaoListagemWire {
  if (Array.isArray(data)) {
    const items = data;
    const contagemPorStatus = emptySolicitationStatusCounts();
    for (const item of items) {
      const status = (item.status ?? 'AGUARDANDO_MATCHING') as StatusSolicitacaoApi;
      contagemPorStatus[status] = (contagemPorStatus[status] ?? 0) + 1;
    }
    return { items, contagemPorStatus };
  }

  if (data && typeof data === 'object' && Array.isArray(data.items)) {
    return {
      items: data.items,
      contagemPorStatus: data.contagemPorStatus ?? {},
    };
  }

  return { items: [], contagemPorStatus: {} };
}

export function mapDetalheWireToResult(
  wire: SolicitacaoDetalheWire,
): SolicitationDetailResult {
  return {
    id: String(wire.id),
    title: wire.titulo,
    description: wire.descricao,
    urgency: wire.urgencia,
    modality: wire.modalidade,
    specialtyCode: wire.especialidadeCodigo,
    subspecialtyCode: wire.subespecialidadeCodigo,
    state: wire.uf,
    city: wire.cidade,
    billingMethod: wire.formaCobranca,
    minimumExperienceMonths: wire.experienciaMinimaMeses,
    totalMatches: wire.totalMatches ?? 0,
    createdAt: wire.criadoEm,
    status: wire.status,
  };
}

export function mapMatchWireToResult(
  wire: SolicitacaoMatchWire,
): SolicitationMatchResult {
  return {
    lawyerId: String(wire.advogadoId),
    name: wire.nome,
    photoUrl: wire.fotoUrl,
    position: wire.posicao,
    compatibility: wire.compatibilidade,
    localityLevel: wire.nivelLocalidade,
    averageRating: wire.mediaAvaliacoes,
    totalReviews: wire.totalAvaliacoes,
  };
}

export function mapMatchResultToCompatibleLawyer(
  match: SolicitationMatchResult,
  index: number,
): CompatibleLawyer {
  return {
    id: match.lawyerId,
    name: match.name,
    honorific: '',
    initials: initialsFromName(match.name),
    rating: formatRating(match.averageRating),
    availability: 'Disponível',
    location: mapLocalidadeLabel(match.localityLevel),
    role: 'Advogado',
    compatibility: match.compatibility,
    avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
    registration: '',
    biography: '',
    address: '',
    supplementalRegistration: '',
    education: '',
    yearsOfExperience: 0,
    specialties: [],
    subspecialties: [],
    billingMethods: [],
    connectionStatus: 'idle',
    phone: '',
    email: '',
  };
}
