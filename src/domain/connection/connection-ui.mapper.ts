import type { SolicitationStatus } from '@/components/client-solicitation-card';
import type { LawyerHistoryItem } from '@/components/lawyer-history';
import type { LawyerSolicitationCardData } from '@/components/lawyer-solicitation-card';
import type {
  LawyerSolicitationDecision,
  LawyerSolicitationDetails,
} from '@/components/lawyer-solicitation-details';
import { PRONOUN_OPTIONS, stateLabelFromValue } from '@/constants/select-options';
import type { ConnectionResult } from '@/data/connection';

function formatConnectionTimeLabel(iso: string): string {
  const text = iso.trim();
  if (!text) {
    return '—';
  }

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) {
    return text;
  }

  return date.toLocaleDateString('pt-BR');
}

function mapUrgenciaToStatus(urgencia: string | null | undefined): SolicitationStatus {
  switch ((urgencia ?? '').trim().toUpperCase()) {
    case 'EMERGENCIA':
      return 'emergencia';
    case 'URGENTE':
      return 'urgente';
    case 'TENHO_TEMPO':
      return 'tenho_tempo';
    case 'MEDIO':
    default:
      return 'medio';
  }
}

function formatLocation(cidade: string | null, uf: string | null): string {
  const city = (cidade ?? '').trim();
  const state = (uf ?? '').trim();
  if (city && state) {
    return `${city}, ${stateLabelFromValue(state) || state}`;
  }
  return city || stateLabelFromValue(state) || '—';
}

function formatPronouns(value: string | null): string {
  const code = (value ?? '').trim().toUpperCase();
  if (!code) {
    return 'Não informado';
  }
  return PRONOUN_OPTIONS.find((option) => option.value === code)?.label ?? code;
}

function formatModalidade(value: string | null): string {
  switch ((value ?? '').trim().toUpperCase()) {
    case 'CONSULTORIA':
      return 'Consultoria';
    case 'PROCESSO':
      return 'Processo';
    case 'MEDIACAO':
      return 'Mediação';
    default:
      return value?.trim() || 'Não informado';
  }
}

function formatBilling(value: string | null): string {
  switch ((value ?? '').trim().toUpperCase()) {
    case 'VALOR_FIXO':
      return 'Valor fixo';
    case 'HORA':
      return 'Por hora';
    case 'EXITO':
      return 'Êxito';
    case 'NEGOCIAR':
      return 'A combinar';
    case 'HONORARIOS_CONTRATUAIS':
      return 'Honorários contratuais';
    case 'HONORARIOS_PERCENTUAIS':
      return 'Honorários percentuais';
    default:
      return value?.trim() || 'Não informado';
  }
}

function formatSpecialtyCode(code: string | null): string {
  const text = (code ?? '').trim();
  if (!text) {
    return '';
  }
  return text
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/** Maps a pending connection into the lawyer home card shape. */
export function mapConnectionToLawyerCard(
  connection: ConnectionResult,
  catalogLabels?: {
    specialtyLabel?: string | null;
  },
): LawyerSolicitationCardData {
  const status = mapUrgenciaToStatus(connection.urgencia);
  const location = formatLocation(connection.cidade, connection.uf);
  const specialty =
    catalogLabels?.specialtyLabel?.trim() ||
    formatSpecialtyCode(connection.especialidadeCodigo);

  return {
    id: connection.id,
    clientName: connection.nomeCliente?.trim() || 'Cliente',
    status,
    description:
      connection.descricaoSolicitacao?.trim()
      || connection.tituloSolicitacao?.trim()
      || 'Pedido de conexão',
    timeLabel: formatConnectionTimeLabel(connection.criadoEm),
    timeKind: 'absolute',
    location,
    specialty,
    isUnviewed: connection.visualizadaEm == null,
  };
}

/** Maps accepted/rejected connections into lawyer history items. */
export function mapConnectionToLawyerHistoryItem(
  connection: ConnectionResult,
  catalogLabels?: {
    specialtyLabel?: string | null;
  },
): LawyerHistoryItem | null {
  if (connection.status !== 'ACEITA' && connection.status !== 'RECUSADA') {
    return null;
  }

  const specialty =
    catalogLabels?.specialtyLabel?.trim() ||
    formatSpecialtyCode(connection.especialidadeCodigo);

  return {
    id: connection.id,
    clientName: connection.nomeCliente?.trim() || 'Cliente',
    urgency: mapUrgenciaToStatus(connection.urgencia),
    description:
      connection.descricaoSolicitacao?.trim()
      || connection.tituloSolicitacao?.trim()
      || 'Pedido de conexão',
    decision: connection.status === 'ACEITA' ? 'accepted' : 'rejected',
    dateLabel: formatConnectionTimeLabel(connection.criadoEm),
    specialty,
  };
}

/** Maps a connection into the lawyer solicitation detail screen model. */
export function mapConnectionToLawyerSolicitationDetails(
  connection: ConnectionResult,
  catalogLabels?: {
    specialtyLabel?: string | null;
    subspecialtyLabel?: string | null;
  },
): LawyerSolicitationDetails {
  const status = mapUrgenciaToStatus(connection.urgencia);
  const specialtyLabel =
    catalogLabels?.specialtyLabel?.trim() ||
    formatSpecialtyCode(connection.especialidadeCodigo);
  const subspecialtyLabel =
    catalogLabels?.subspecialtyLabel?.trim() ||
    formatSpecialtyCode(connection.subespecialidadeCodigo);

  let decision: LawyerSolicitationDecision | undefined;
  if (connection.status === 'ACEITA') {
    decision = 'accepted';
  } else if (connection.status === 'RECUSADA') {
    decision = 'rejected';
  }

  const reviewRating = connection.avaliacaoClienteNota;
  const reviewComment = connection.avaliacaoClienteComentario?.trim() || '';
  const clientReview =
    reviewRating != null
      ? { rating: reviewRating, comment: reviewComment }
      : null;

  return {
    id: connection.id,
    title: connection.tituloSolicitacao?.trim() || 'Solicitação',
    status,
    practice: formatModalidade(connection.modalidade),
    specialties: specialtyLabel ? [specialtyLabel] : [],
    subspecialties: subspecialtyLabel ? [subspecialtyLabel] : [],
    minimumExperienceMonths: connection.experienciaMinimaMeses ?? 0,
    location: formatLocation(connection.cidade, connection.uf),
    billingMethod: formatBilling(connection.formaCobranca),
    description:
      connection.descricaoSolicitacao?.trim() || 'Sem descrição informada.',
    decision,
    clientReview,
    client: {
      name: connection.nomeCliente?.trim() || 'Cliente',
      location: formatLocation(connection.clienteCidade, connection.clienteUf),
      pronouns: formatPronouns(connection.clientePronomes),
      maritalStatus: connection.clienteEstadoCivil?.trim() || 'Não informado',
      profession: connection.clienteProfissao?.trim() || 'Não informado',
      monthlyIncome: connection.clienteFaixaRenda?.trim() || 'Não informado',
      phone: connection.clienteTelefone?.trim() || '',
      email: connection.clienteEmail?.trim() || '',
      photoKey: connection.clienteFotoUrl?.trim() || null,
    },
  };
}

export function isEmergencyConnection(connection: ConnectionResult): boolean {
  return mapUrgenciaToStatus(connection.urgencia) === 'emergencia';
}
