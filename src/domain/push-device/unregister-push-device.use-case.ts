import { HttpError } from '@/data/http';
import {
  clearPushDeviceToken,
  loadPushDeviceToken,
  unregisterPushDevice,
} from '@/data/push-device';

export async function unregisterPushDeviceUseCase(): Promise<void> {
  const expoPushToken = await loadPushDeviceToken();
  if (!expoPushToken) {
    return;
  }

  try {
    await unregisterPushDevice({ expoPushToken });
  } catch (error) {
    if (!(error instanceof HttpError && error.status === 404)) {
      // Still drop the local token so logout can finish.
    }
  } finally {
    await clearPushDeviceToken();
  }
}
