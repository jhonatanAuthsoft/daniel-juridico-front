import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const DEVICE_ID_KEY = 'laweact.device.id';

type KeyValueStore = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
};

function createWebStore(): KeyValueStore {
  return {
    getItem: async (key) => {
      try {
        return globalThis.localStorage?.getItem(key) ?? null;
      } catch {
        return null;
      }
    },
    setItem: async (key, value) => {
      try {
        globalThis.localStorage?.setItem(key, value);
      } catch {
        // ignore quota / private mode
      }
    },
  };
}

function createNativeStore(): KeyValueStore {
  return {
    getItem: (key) => SecureStore.getItemAsync(key),
    setItem: (key, value) => SecureStore.setItemAsync(key, value),
  };
}

const store: KeyValueStore = Platform.OS === 'web' ? createWebStore() : createNativeStore();

function createDeviceId(): string {
  const random =
    globalThis.crypto?.randomUUID?.() ??
    `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, (char) => {
      const r = (Math.random() * 16) | 0;
      const v = char === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });

  return `${Platform.OS}-${random}`;
}

/**
 * Stable installation id for session binding (`deviceId` on login).
 * Created once and persisted locally.
 */
export async function getOrCreateDeviceId(): Promise<string> {
  const existing = await store.getItem(DEVICE_ID_KEY);
  if (existing?.trim()) {
    return existing.trim();
  }

  const deviceId = createDeviceId();
  await store.setItem(DEVICE_ID_KEY, deviceId);
  return deviceId;
}
