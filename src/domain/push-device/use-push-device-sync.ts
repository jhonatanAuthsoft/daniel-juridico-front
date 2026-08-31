import { useEffect } from 'react';

import { useAuth } from '@/domain/auth/auth-provider';
import { useMe } from '@/domain/auth/use-me';

import { syncPushDeviceUseCase } from './sync-push-device.use-case';
import { unregisterPushDeviceUseCase } from './unregister-push-device.use-case';

/**
 * Registers the Expo push token after login and on authenticated cold start.
 * Failures are swallowed so auth is never blocked.
 */
export function usePushDeviceSync() {
  const { token, isHydrating } = useAuth();
  const { data: me } = useMe();

  useEffect(() => {
    if (isHydrating || !token) {
      return;
    }

    if (me?.pushNotificationsEnabled === false) {
      void unregisterPushDeviceUseCase().catch(() => undefined);
      return;
    }

    void syncPushDeviceUseCase().catch(() => undefined);
  }, [isHydrating, token, me?.pushNotificationsEnabled]);
}

/** Mount under AuthProvider to register the device after login / cold start. */
export function PushDeviceSync() {
  usePushDeviceSync();
  return null;
}
