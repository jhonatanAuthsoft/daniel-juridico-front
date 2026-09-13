import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const ANDROID_PUSH_CHANNEL_DEFAULT = 'default';
export const ANDROID_PUSH_CHANNEL_URGENT = 'urgent';

async function ensureAndroidNotificationChannels() {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(ANDROID_PUSH_CHANNEL_DEFAULT, {
    name: 'Solicitações',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
  await Notifications.setNotificationChannelAsync(ANDROID_PUSH_CHANNEL_URGENT, {
    name: 'Urgências e emergências',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
  });
}

function resolveEasProjectId(): string | undefined {
  const fromEas = Constants.easConfig?.projectId;
  if (typeof fromEas === 'string' && fromEas.trim()) {
    return fromEas.trim();
  }
  const fromExtra = Constants.expoConfig?.extra?.eas?.projectId;
  if (typeof fromExtra === 'string' && fromExtra.trim()) {
    return fromExtra.trim();
  }
  return undefined;
}

/**
 * Asks OS permission (if needed) and returns an Expo push token.
 * Returns null on web, simulator, denied permission, or any Expo error.
 */
export async function getExpoPushToken(): Promise<string | null> {
  if (Platform.OS === 'web' || !Device.isDevice) {
    return null;
  }

  try {
    const existing = await Notifications.getPermissionsAsync();
    let status = existing.status;
    if (status !== 'granted') {
      const requested = await Notifications.requestPermissionsAsync();
      status = requested.status;
    }
    if (status !== 'granted') {
      return null;
    }

    if (Platform.OS === 'android') {
      await ensureAndroidNotificationChannels();
    }

    const projectId = resolveEasProjectId();
    const token = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );
    const value = token.data?.trim() ?? '';
    return value.length > 0 ? value : null;
  } catch {
    return null;
  }
}
