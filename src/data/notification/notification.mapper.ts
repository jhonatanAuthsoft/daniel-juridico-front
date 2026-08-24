import type {
  NaoLidasExisteWire,
  NotificacaoWire,
  NotificationResult,
  ReferenciaNotificacaoApi,
  StatusEnvioNotificacaoApi,
  TipoNotificacaoApi,
  UnreadExistsResult,
} from './notification.types';

const TIPOS: ReadonlySet<string> = new Set([
  'CONEXAO_SOLICITADA',
  'CONEXAO_ACEITA',
]);

const REFERENCIAS: ReadonlySet<string> = new Set(['CONEXAO']);

const STATUS_ENVIO: ReadonlySet<string> = new Set([
  'PENDENTE',
  'ENVIADA',
  'SKIPPED',
  'ERROR',
]);

function asText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function asNullableText(value: unknown): string | null {
  const text = asText(value);
  return text.length > 0 ? text : null;
}

function asTipo(value: unknown): TipoNotificacaoApi {
  if (typeof value === 'string' && TIPOS.has(value)) {
    return value as TipoNotificacaoApi;
  }
  return 'CONEXAO_SOLICITADA';
}

function asReferencia(value: unknown): ReferenciaNotificacaoApi {
  if (typeof value === 'string' && REFERENCIAS.has(value)) {
    return value as ReferenciaNotificacaoApi;
  }
  return 'CONEXAO';
}

function asStatusEnvio(value: unknown): StatusEnvioNotificacaoApi {
  if (typeof value === 'string' && STATUS_ENVIO.has(value)) {
    return value as StatusEnvioNotificacaoApi;
  }
  return 'PENDENTE';
}

export function formatNotificationDate(iso: string): string {
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

export function mapNotificacaoWireToResult(
  wire: NotificacaoWire,
): NotificationResult {
  const readAt = asNullableText(wire?.lidaEm);

  return {
    id: asText(wire?.id),
    title: asText(wire?.titulo),
    body: asText(wire?.texto),
    type: asTipo(wire?.tipo),
    referenceType: asReferencia(wire?.referenciaTipo),
    referenceId: asText(wire?.referenciaId),
    senderId: asText(wire?.remetenteId),
    createdAt: asText(wire?.criadoEm),
    readAt,
    isUnread: readAt == null,
    deliveryStatus: asStatusEnvio(wire?.statusEnvio),
  };
}

export function mapNaoLidasWireToResult(
  wire: NaoLidasExisteWire,
): UnreadExistsResult {
  return { exists: Boolean(wire?.existe) };
}
