import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { NotificationResult } from '@/data/notification';

import { notificationKeys } from './notification.keys';
import {
  markAllNotificationsReadUseCase,
  markNotificationReadUseCase,
} from './notification.use-cases';

async function invalidateNotificationQueries(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: notificationKeys.lists() }),
    queryClient.invalidateQueries({ queryKey: notificationKeys.unreadExists() }),
  ]);
}

type ListCacheSnapshot = [
  readonly unknown[],
  NotificationResult[] | undefined,
][];

/** `POST /notificacoes/{id}/ler` — optimistic mark as read. */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      markNotificationReadUseCase(notificationId),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.lists() });

      const previous = queryClient.getQueriesData<NotificationResult[]>({
        queryKey: notificationKeys.lists(),
      }) as ListCacheSnapshot;

      const readAt = new Date().toISOString();
      queryClient.setQueriesData<NotificationResult[]>(
        { queryKey: notificationKeys.lists() },
        (old) =>
          old?.map((item) =>
            item.id === notificationId
              ? { ...item, readAt, isUnread: false }
              : item,
          ),
      );

      return { previous };
    },
    onError: (_error, _id, context) => {
      context?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: async () => {
      await invalidateNotificationQueries(queryClient);
    },
  });
}

/** `POST /notificacoes/ler-todas` */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsReadUseCase(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.lists() });

      const previous = queryClient.getQueriesData<NotificationResult[]>({
        queryKey: notificationKeys.lists(),
      }) as ListCacheSnapshot;

      const readAt = new Date().toISOString();
      queryClient.setQueriesData<NotificationResult[]>(
        { queryKey: notificationKeys.lists() },
        (old) =>
          old?.map((item) =>
            item.isUnread ? { ...item, readAt, isUnread: false } : item,
          ),
      );
      queryClient.setQueryData(notificationKeys.unreadExists(), {
        exists: false,
      });

      return { previous };
    },
    onError: (_error, _vars, context) => {
      context?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: async () => {
      await invalidateNotificationQueries(queryClient);
    },
  });
}
