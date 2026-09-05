import type {
  ClientConnectionUiStatus,
  ConexaoListagemWire,
  ConexaoWire,
  ConnectionResult,
  ConnectionStatusCounts,
  ConnectionUrgencyCounts,
  StatusConexaoApi,
  UrgenciaConexaoApi,
} from './connection.types';

const STATUS_API: readonly StatusConexaoApi[] = [
  'PENDENTE',
  'ACEITA',
  'RECUSADA',
  'CANCELADA',
];

const STATUS_API_SET: ReadonlySet<string> = new Set(STATUS_API);

const URGENCY_API: readonly UrgenciaConexaoApi[] = [
  'EMERGENCIA',
  'URGENTE',
  'MEDIO',
  'TENHO_TEMPO',
];

function asText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function asNullableText(value: unknown): string | null {
  const text = asText(value);
  return text.length > 0 ? text : null;
}

function asNullableNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function asStatus(value: unknown): StatusConexaoApi {
  if (typeof value === 'string' && STATUS_API_SET.has(value)) {
    return value as StatusConexaoApi;
  }
  return 'CANCELADA';
}

export function emptyConnectionUrgencyCounts(): ConnectionUrgencyCounts {
  return {
    EMERGENCIA: 0,
    URGENTE: 0,
    MEDIO: 0,
    TENHO_TEMPO: 0,
  };
}

export function mapContagemPorUrgencia(
  contagem: Partial<Record<UrgenciaConexaoApi, number>> | null | undefined,
): ConnectionUrgencyCounts {
  const counts = emptyConnectionUrgencyCounts();
  for (const urgency of URGENCY_API) {
    counts[urgency] = Number(contagem?.[urgency] ?? 0);
  }
  return counts;
}

export function emptyConnectionStatusCounts(): ConnectionStatusCounts {
  return {
    PENDENTE: 0,
    ACEITA: 0,
    RECUSADA: 0,
    CANCELADA: 0,
  };
}

export function mapContagemPorStatus(
  contagem: Partial<Record<StatusConexaoApi, number>> | null | undefined,
): ConnectionStatusCounts {
  const counts = emptyConnectionStatusCounts();
  for (const status of STATUS_API) {
    counts[status] = Number(contagem?.[status] ?? 0);
  }
  return counts;
}

/**
 * Normalizes the `GET /conexoes` payload.
 * Current shape: `{ items, contagemPorUrgencia, contagemPorStatus }`.
 * Legacy shape: bare `ConexaoWire[]`, whose counts are derived locally.
 */
export function normalizeConexaoListagemPayload(
  data: ConexaoListagemWire | ConexaoWire[] | null | undefined,
): ConexaoListagemWire {
  if (Array.isArray(data)) {
    const contagemPorUrgencia = emptyConnectionUrgencyCounts();
    const contagemPorStatus = emptyConnectionStatusCounts();
    for (const item of data) {
      const urgency = (item?.urgencia ?? '').trim().toUpperCase();
      if ((URGENCY_API as readonly string[]).includes(urgency)) {
        const key = urgency as UrgenciaConexaoApi;
        contagemPorUrgencia[key] += 1;
      }
      const status = asStatus(item?.status);
      contagemPorStatus[status] += 1;
    }
    return { items: data, contagemPorUrgencia, contagemPorStatus };
  }

  if (data && typeof data === 'object' && Array.isArray(data.items)) {
    return {
      items: data.items,
      contagemPorUrgencia: data.contagemPorUrgencia ?? {},
      contagemPorStatus: data.contagemPorStatus ?? {},
    };
  }

  return { items: [], contagemPorUrgencia: {}, contagemPorStatus: {} };
}

export function mapConexaoStatusToUi(
  status: StatusConexaoApi | null | undefined,
): ClientConnectionUiStatus {
  switch (status) {
    case 'PENDENTE':
      return 'pending';
    case 'ACEITA':
      return 'accepted';
    case 'RECUSADA':
      return 'rejected';
    case 'CANCELADA':
    case null:
    case undefined:
      return 'idle';
    default:
      return 'idle';
  }
}

export function mapConexaoWireToResult(wire: ConexaoWire): ConnectionResult {
  const status = asStatus(wire?.status);

  return {
    id: asText(wire?.id),
    solicitacaoId: asText(wire?.solicitacaoId),
    clienteId: asText(wire?.clienteId),
    advogadoId: asText(wire?.advogadoId),
    status,
    uiStatus: mapConexaoStatusToUi(status),
    criadoEm: asText(wire?.criadoEm),
    decididoEm: asNullableText(wire?.decididoEm),
    canceladoEm: asNullableText(wire?.canceladoEm),
    visualizadaEm: asNullableText(wire?.visualizadaEm),
    telefone: asNullableText(wire?.telefone),
    email: asNullableText(wire?.email),
    nomeAdvogado: asNullableText(wire?.nomeAdvogado),
    nomeCliente: asNullableText(wire?.nomeCliente),
    tituloSolicitacao: asNullableText(wire?.tituloSolicitacao),
    descricaoSolicitacao: asNullableText(wire?.descricaoSolicitacao),
    urgencia: asNullableText(wire?.urgencia),
    modalidade: asNullableText(wire?.modalidade),
    especialidadeCodigo: asNullableText(wire?.especialidadeCodigo),
    subespecialidadeCodigo: asNullableText(wire?.subespecialidadeCodigo),
    experienciaMinimaMeses: asNullableNumber(wire?.experienciaMinimaMeses),
    uf: asNullableText(wire?.uf),
    cidade: asNullableText(wire?.cidade),
    formaCobranca: asNullableText(wire?.formaCobranca),
    clienteProfissao: asNullableText(wire?.clienteProfissao),
    clientePronomes: asNullableText(wire?.clientePronomes),
    clienteEstadoCivil: asNullableText(wire?.clienteEstadoCivil),
    clienteFaixaRenda: asNullableText(wire?.clienteFaixaRenda),
    clienteFotoUrl: asNullableText(wire?.clienteFotoUrl),
    clienteCidade: asNullableText(wire?.clienteCidade),
    clienteUf: asNullableText(wire?.clienteUf),
    clienteTelefone: asNullableText(wire?.clienteTelefone),
    clienteEmail: asNullableText(wire?.clienteEmail),
    avaliacaoClienteNota: asNullableNumber(wire?.avaliacaoClienteNota),
    avaliacaoClienteComentario: asNullableText(wire?.avaliacaoClienteComentario),
  };
}
