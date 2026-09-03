import { getIapProvider } from './iap-provider';
import { validateSubscriptionUseCase } from './validate-subscription.use-case';
import { writeCachedSubscription } from './subscription-cache';

export async function purchaseSubscriptionUseCase(params: {
  productId: string;
  accountId?: string;
}): Promise<void> {
  const provider = getIapProvider();
  const purchase = await provider.requestPurchase(params.productId, params.accountId);

  const validated = await validateSubscriptionUseCase({
    platform: purchase.platform,
    productId: purchase.productId,
    purchaseToken: purchase.purchaseToken,
  });

  await provider.finishTransaction(purchase.purchaseToken);
  await writeCachedSubscription(validated);
}

export async function restoreSubscriptionUseCase(): Promise<boolean> {
  const provider = getIapProvider();
  const purchases = await provider.restorePurchases();
  if (purchases.length === 0) {
    return false;
  }

  const latest = purchases[purchases.length - 1];
  const validated = await validateSubscriptionUseCase({
    platform: latest.platform,
    productId: latest.productId,
    purchaseToken: latest.purchaseToken,
  });
  await provider.finishTransaction(latest.purchaseToken);
  await writeCachedSubscription(validated);
  return true;
}
