import type {
  ClientConnectionUiStatus,
  ConexaoWire,
  ConnectionResult,
  StatusConexaoApi,
} from './connection.types';

const STATUS_API: ReadonlySet<string> = new Set([
  'PENDENTE',
  'ACEITA',
  'RECUSADA',
  'CANCELADA',
]);

function asText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function asNullableText(value: unknown): string | null {
  const text = asText(value);
  return text.length > 0 ? text : null;
}

function asStatus(value: unknown): StatusConexaoApi {
  if (typeof value === 'string' && STATUS_API.has(value)) {
    return value as StatusConexaoApi;
  }
  return 'CANCELADA';
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
    telefone: asNullableText(wire?.telefone),
    email: asNullableText(wire?.email),
    nomeAdvogado: asNullableText(wire?.nomeAdvogado),
    nomeCliente: asNullableText(wire?.nomeCliente),
    tituloSolicitacao: asNullableText(wire?.tituloSolicitacao),
  };
}
