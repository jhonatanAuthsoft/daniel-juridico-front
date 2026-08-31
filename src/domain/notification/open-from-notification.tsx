import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';

import { useAuth } from '@/domain/auth';

import { notificationsInboxHrefForRole } from './notifications-inbox-href';

/**
 * When the user opens the app by tapping a push notification, land on the
 * notifications tab for their role. Handles cold start and background taps.
 */
export function useOpenFromNotification() {
  const router = useRouter();
  const { isHydrating, isAuthenticated, user } = useAuth();
  const lastResponse = Notifications.useLastNotificationResponse();
  const handledId = useRef<string | null>(null);

  useEffect(() => {
    if (isHydrating || !isAuthenticated || !user?.termsAccepted) {
      return;
    }
    if (!lastResponse) {
      return;
    }
    if (lastResponse.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) {
      return;
    }

    const identifier = lastResponse.notification.request.identifier;
    if (handledId.current === identifier) {
      return;
    }
    handledId.current = identifier;

    router.navigate(notificationsInboxHrefForRole(user.role));
    Notifications.clearLastNotificationResponse();
  }, [isAuthenticated, isHydrating, lastResponse, router, user]);
}

/** Mount next to PushDeviceSync so notification taps can change route. */
export function OpenFromNotification() {
  useOpenFromNotification();
  return null;
}
