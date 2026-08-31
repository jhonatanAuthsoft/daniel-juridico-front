import { Platform } from 'react-native';

import {
  mapOsToPushPlatform,
  registerPushDevice,
  savePushDeviceToken,
} from '@/data/push-device';

import { getExpoPushToken } from './get-expo-push-token';

export async function syncPushDeviceUseCase(): Promise<void> {
  const expoPushToken = await getExpoPushToken();
  if (!expoPushToken) {
    return;
  }

  const platform = mapOsToPushPlatform(Platform.OS);
  if (platform == null || platform === 'WEB') {
    return;
  }

  await savePushDeviceToken(expoPushToken);
  await registerPushDevice({ expoPushToken, platform });
}
