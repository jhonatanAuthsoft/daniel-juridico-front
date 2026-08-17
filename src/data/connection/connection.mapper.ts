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
