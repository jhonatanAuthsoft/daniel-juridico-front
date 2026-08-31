import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'laweact.push.expo-token';

type KeyValueStore = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  deleteItem: (key: string) => Promise<void>;
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
    deleteItem: async (key) => {
      try {
        globalThis.localStorage?.removeItem(key);
      } catch {
        // ignore
      }
    },
  };
}

function createNativeStore(): KeyValueStore {
  return {
    getItem: (key) => SecureStore.getItemAsync(key),
    setItem: (key, value) => SecureStore.setItemAsync(key, value),
    deleteItem: (key) => SecureStore.deleteItemAsync(key),
  };
}

const store: KeyValueStore =
  Platform.OS === 'web' ? createWebStore() : createNativeStore();

export async function loadPushDeviceToken(): Promise<string | null> {
  const token = await store.getItem(TOKEN_KEY);
  const trimmed = token?.trim() ?? '';
  return trimmed.length > 0 ? trimmed : null;
}

export async function savePushDeviceToken(token: string): Promise<void> {
  await store.setItem(TOKEN_KEY, token.trim());
}

export async function clearPushDeviceToken(): Promise<void> {
  await store.deleteItem(TOKEN_KEY);
}
