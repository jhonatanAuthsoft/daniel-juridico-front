import type { UserRole } from '@/domain/auth';
import type { NotificationResult } from '@/data/notification';

export type ResolveNotificationHrefParams = {
  role: UserRole;
  notification: Pick<
    NotificationResult,
    'type' | 'referenceType' | 'referenceId'
  >;
  /** Required for CLIENT when reference is CONEXAO (id da conexão → solicitação). */
  solicitationId?: string | null;
};

/**
 * Maps an inbox notification to an in-app route.
 */
export function resolveNotificationHref(
  params: ResolveNotificationHrefParams,
): string | null {
  const referenceId = params.notification.referenceId.trim();
  if (!referenceId) {
    return null;
  }

  if (params.notification.referenceType !== 'CONEXAO') {
    return null;
  }

  if (params.role === 'LAWYER') {
    // Lawyer solicitation details screen is keyed by connection id.
    return `/lawyer/solicitacao/${encodeURIComponent(referenceId)}`;
  }

  const solicitationId = params.solicitationId?.trim() ?? '';
  if (!solicitationId) {
    return null;
  }

  return `/client/solicitacao/${encodeURIComponent(solicitationId)}`;
}
