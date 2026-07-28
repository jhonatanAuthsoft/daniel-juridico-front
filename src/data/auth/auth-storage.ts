import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { AuthUser } from '@/domain/auth/auth.types';

const SESSION_KEY = 'laweact.auth.session';

export type AuthSession = {
  token: string;
  refreshToken: string;
  user: AuthUser;
};

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

const store: KeyValueStore = Platform.OS === 'web' ? createWebStore() : createNativeStore();

export async function saveAuthSession(session: AuthSession): Promise<void> {
  await store.setItem(SESSION_KEY, JSON.stringify(session));
}

export async function loadAuthSession(): Promise<AuthSession | null> {
  const raw = await store.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.token || !parsed?.user?.id || !parsed?.user?.role) {
      return null;
    }

    return {
      token: parsed.token,
      refreshToken: typeof parsed.refreshToken === 'string' ? parsed.refreshToken : '',
      user: {
        ...parsed.user,
        termsAccepted: parsed.user.termsAccepted === true,
      },
    };
  } catch {
    return null;
  }
}

export async function clearAuthSession(): Promise<void> {
  await store.deleteItem(SESSION_KEY);
}
