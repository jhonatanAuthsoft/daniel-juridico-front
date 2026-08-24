import {
  apiUrl,
  assertApiSuccess,
  authenticatedHttpRequest,
  type ApiResponse,
} from '@/data/http';

import {
  mapNaoLidasWireToResult,
  mapNotificacaoWireToResult,
} from './notification.mapper';
import type {
  ListNotificationsParams,
  NaoLidasExisteWire,
  NotificacaoWire,
  NotificationResult,
  UnreadExistsResult,
} from './notification.types';

function requireId(value: string, label: string): string {
  const id = value.trim();
  if (!id) {
    throw new Error(`${label} inválido.`);
  }
  return id;
}

/** `GET /notificacoes?limit=&offset=` */
export async function listNotifications(
  params: ListNotificationsParams = {},
  signal?: AbortSignal,
): Promise<NotificationResult[]> {
  const query = new URLSearchParams();
  if (params.limit != null) {
    query.set('limit', String(params.limit));
  }
  if (params.offset != null) {
    query.set('offset', String(params.offset));
  }
  const suffix = query.toString() ? `?${query.toString()}` : '';

  const response = await authenticatedHttpRequest<ApiResponse<NotificacaoWire[]>>(
    apiUrl(`/notificacoes${suffix}`),
    { method: 'GET', signal },
  );

  const data = assertApiSuccess(
    response,
    'Não foi possível carregar as notificações.',
  );
  return (Array.isArray(data) ? data : []).map(mapNotificacaoWireToResult);
}

/** `GET /notificacoes/nao-lidas/existe` */
export async function getUnreadNotificationsExist(
  signal?: AbortSignal,
): Promise<UnreadExistsResult> {
  const response = await authenticatedHttpRequest<
    ApiResponse<NaoLidasExisteWire>
  >(apiUrl('/notificacoes/nao-lidas/existe'), { method: 'GET', signal });

  const data = assertApiSuccess(
    response,
    'Não foi possível verificar notificações não lidas.',
  );
  return mapNaoLidasWireToResult(data);
}

/** `POST /notificacoes/{id}/ler` */
export async function markNotificationRead(
  notificationId: string,
  signal?: AbortSignal,
): Promise<NotificationResult> {
  const id = requireId(notificationId, 'Identificador da notificação');

  const response = await authenticatedHttpRequest<ApiResponse<NotificacaoWire>>(
    apiUrl(`/notificacoes/${encodeURIComponent(id)}/ler`),
    { method: 'POST', body: {}, signal },
  );

  const data = assertApiSuccess(
    response,
    'Não foi possível marcar a notificação como lida.',
  );
  return mapNotificacaoWireToResult(data);
}

/** `POST /notificacoes/ler-todas` */
export async function markAllNotificationsRead(
  signal?: AbortSignal,
): Promise<void> {
  const response = await authenticatedHttpRequest<ApiResponse<boolean>>(
    apiUrl('/notificacoes/ler-todas'),
    { method: 'POST', body: {}, signal },
  );

  assertApiSuccess(response, 'Não foi possível marcar as notificações como lidas.');
}
