import * as SecureStore from 'expo-secure-store';

import type { SubscriptionResult } from '@/data/subscription';

const CACHE_KEY = 'laweact.subscription.cache';
const CACHE_TTL_MS = 5 * 60 * 1000;

type CachedSubscription = {
  savedAt: number;
  subscription: SubscriptionResult;
};

export async function readCachedSubscription(): Promise<SubscriptionResult | null> {
  try {
    const raw = await SecureStore.getItemAsync(CACHE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as CachedSubscription;
    if (Date.now() - parsed.savedAt > CACHE_TTL_MS) {
      return null;
    }
    return parsed.subscription;
  } catch {
    return null;
  }
}

export async function writeCachedSubscription(subscription: SubscriptionResult): Promise<void> {
  const payload: CachedSubscription = {
    savedAt: Date.now(),
    subscription,
  };
  await SecureStore.setItemAsync(CACHE_KEY, JSON.stringify(payload));
}

export async function clearCachedSubscription(): Promise<void> {
  await SecureStore.deleteItemAsync(CACHE_KEY);
}
