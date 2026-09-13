import type { SubscriptionResult, ValidateSubscriptionParams } from '@/data/subscription';
import { validateSubscription } from '@/data/subscription';

export async function validateSubscriptionUseCase(
  params: ValidateSubscriptionParams,
  signal?: AbortSignal,
): Promise<SubscriptionResult> {
  return validateSubscription(params, signal);
}
