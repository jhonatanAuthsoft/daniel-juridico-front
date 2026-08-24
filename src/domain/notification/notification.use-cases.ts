import {
  getUnreadNotificationsExist,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type ListNotificationsParams,
} from '@/data/notification';

export function listNotificationsUseCase(
  params?: ListNotificationsParams,
  signal?: AbortSignal,
) {
  return listNotifications(params, signal);
}

export function getUnreadNotificationsExistUseCase(signal?: AbortSignal) {
  return getUnreadNotificationsExist(signal);
}

export function markNotificationReadUseCase(
  notificationId: string,
  signal?: AbortSignal,
) {
  return markNotificationRead(notificationId, signal);
}

export function markAllNotificationsReadUseCase(signal?: AbortSignal) {
  return markAllNotificationsRead(signal);
}
