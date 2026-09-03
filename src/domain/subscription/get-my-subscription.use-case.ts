import type { SubscriptionResult } from '@/data/subscription';
import { getMySubscription } from '@/data/subscription';

export async function getMySubscriptionUseCase(signal?: AbortSignal): Promise<SubscriptionResult> {
  return getMySubscription(signal);
}
