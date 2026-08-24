import type { NotificationResult } from '@/data/notification';
import type { UserRole } from '@/domain/auth';
import { listConnectionsUseCase } from '@/domain/connection';

import { resolveNotificationHref } from './resolve-notification-href';

/**
 * Resolves the in-app href for a notification.
 * Lawyer: connection id is enough.
 * Client: looks up the connection to get solicitacaoId.
 */
export async function resolveNotificationHrefUseCase(
  role: UserRole,
  notification: NotificationResult,
  signal?: AbortSignal,
): Promise<string | null> {
  if (role === 'LAWYER') {
    return resolveNotificationHref({ role, notification });
  }

  if (notification.referenceType !== 'CONEXAO') {
    return null;
  }

  const connections = await listConnectionsUseCase({}, signal);
  const connection = connections.find(
    (item) => item.id === notification.referenceId,
  );

  return resolveNotificationHref({
    role,
    notification,
    solicitationId: connection?.solicitacaoId,
  });
}
