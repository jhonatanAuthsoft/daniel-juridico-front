import type { UserRole } from '@/domain/auth';

export function notificationsInboxHrefForRole(
  role: UserRole,
): '/client/notificacoes' | '/lawyer/notificacoes' {
  return role === 'LAWYER' ? '/lawyer/notificacoes' : '/client/notificacoes';
}
