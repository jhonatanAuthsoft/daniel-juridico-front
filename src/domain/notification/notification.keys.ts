export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (limit?: number, offset?: number) =>
    [...notificationKeys.lists(), { limit, offset }] as const,
  unreadExists: () => [...notificationKeys.all, 'unread-exists'] as const,
};
