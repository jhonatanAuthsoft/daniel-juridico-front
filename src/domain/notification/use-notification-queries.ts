import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

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

/** Tab bar stays mounted, so unread-exists would never refetch without polling. */
export const UNREAD_EXISTS_REFETCH_INTERVAL_MS = 15_000;

/** `GET /notificacoes` — inbox do usuário autenticado. */
export function useNotifications(
  params: ListNotificationsParams = DEFAULT_LIST_PARAMS,
) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: notificationKeys.list(params.limit, params.offset),
    queryFn: ({ signal }) => listNotificationsUseCase(params, signal),
    enabled: isAuthenticated,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!query.isSuccess || query.data == null) {
      return;
    }

    queryClient.setQueryData(notificationKeys.unreadExists(), {
      exists: query.data.some((item) => item.isUnread),
    });
  }, [query.data, query.isSuccess, queryClient]);

  return query;
}

/** `GET /notificacoes/nao-lidas/existe` */
export function useUnreadNotificationsExist() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: notificationKeys.unreadExists(),
    queryFn: ({ signal }) => getUnreadNotificationsExistUseCase(signal),
    enabled: isAuthenticated,
    refetchInterval: UNREAD_EXISTS_REFETCH_INTERVAL_MS,
    refetchOnWindowFocus: true,
  });
}
