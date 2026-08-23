import { useQuery } from '@tanstack/react-query';

import type { ListNotificationsParams } from '@/data/notification';
import { useAuth } from '@/domain/auth';

import { notificationKeys } from './notification.keys';
import {
  getUnreadNotificationsExistUseCase,
  listNotificationsUseCase,
} from './notification.use-cases';

const DEFAULT_LIST_PARAMS: ListNotificationsParams = {
  limit: 50,
  offset: 0,
};

/** `GET /notificacoes` — inbox do usuário autenticado. */
export function useNotifications(
  params: ListNotificationsParams = DEFAULT_LIST_PARAMS,
) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: notificationKeys.list(params.limit, params.offset),
    queryFn: ({ signal }) => listNotificationsUseCase(params, signal),
    enabled: isAuthenticated,
  });
}

/** `GET /notificacoes/nao-lidas/existe` */
export function useUnreadNotificationsExist() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: notificationKeys.unreadExists(),
    queryFn: ({ signal }) => getUnreadNotificationsExistUseCase(signal),
    enabled: isAuthenticated,
  });
}
