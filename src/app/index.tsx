import { Redirect } from 'expo-router';
import { useRef } from 'react';
import * as Notifications from 'expo-notifications';

import { useAuth } from '@/domain/auth';
import { notificationsInboxHrefForRole } from '@/domain/notification';

function readLaunchNotificationResponse() {
  try {
    return Notifications.getLastNotificationResponse();
  } catch {
    return null;
  }
}

export default function Index() {
  const { isAuthenticated, homeHref, isHydrating, user } = useAuth();
  const openedFromNotification = useRef(readLaunchNotificationResponse()).current;

  if (isHydrating) {
    return null;
  }

  if (isAuthenticated && user) {
    if (!user.termsAccepted) {
      return <Redirect href="/signup/terms" />;
    }
    if (openedFromNotification) {
      return <Redirect href={notificationsInboxHrefForRole(user.role)} />;
    }
    return <Redirect href={homeHref} />;
  }

  return <Redirect href="/login" />;
}
