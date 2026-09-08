import { Platform } from 'react-native';

import type { IapProduct, IapPurchaseResult, SubscriptionPlatform } from '@/data/subscription';

import { mapStoreProductToIapProduct } from './iap-product.mapper';

export type IapProvider = {
  fetchProducts: (productIds: string[]) => Promise<IapProduct[]>;
  requestPurchase: (
    productId: string,
    accountId?: string,
    offerToken?: string | null,
  ) => Promise<IapPurchaseResult>;
  restorePurchases: () => Promise<IapPurchaseResult[]>;
  finishTransaction: (purchaseToken: string) => Promise<void>;
};

function resolvePlatform(): SubscriptionPlatform {
  if (process.env.EXPO_PUBLIC_IAP_PROVIDER === 'fake') {
    return 'FAKE';
  }
  return Platform.OS === 'ios' ? 'IOS' : 'ANDROID';
}

function randomFakeToken(): string {
  return `fake:${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createFakeProvider(): IapProvider {
  return {
    async fetchProducts(productIds) {
      return productIds.map((productId) => ({
        productId,
        title: 'Plano Basic',
        description: 'Assinatura mensal do Laweact',
        localizedPrice: 'R$ 35,00',
        currency: 'BRL',
        hasFreeTrial: true,
        freeTrialLabel: '1 mês',
        offerToken: null,
      }));
    },
    async requestPurchase(productId) {
      return {
        productId,
        purchaseToken: randomFakeToken(),
        platform: 'FAKE',
      };
    },
    async restorePurchases() {
      return [];
    },
    async finishTransaction() {
      // noop
    },
  };
}

let runtimeProvider: IapProvider | null = null;

export function setRuntimeIapProvider(provider: IapProvider | null) {
  runtimeProvider = provider;
}

export function getIapProvider(): IapProvider {
  if (runtimeProvider) {
    return runtimeProvider;
  }
  if (process.env.EXPO_PUBLIC_IAP_PROVIDER === 'fake') {
    return createFakeProvider();
  }
  throw new Error('IAP provider não inicializado. Monte <IapRuntimeProvider />.');
}

export type StorePurchaseHandlers = {
  onPurchase: (purchase: unknown) => void;
  onError: (error: unknown) => void;
};

type ExpoIapHook = {
  fetchProducts: (params: { skus: string[]; type: 'subs' }) => Promise<unknown[] | undefined>;
  requestPurchase: (params: {
    type: 'subs';
    request: {
      apple?: { sku: string };
      google?: {
        skus: string[];
        obfuscatedAccountId?: string;
        subscriptionOffers?: { sku: string; offerToken: string }[];
      };
    };
  }) => Promise<unknown>;
  getAvailablePurchases: () => Promise<unknown[] | undefined>;
  finishTransaction: (params: { purchase: unknown; isConsumable: boolean }) => Promise<void>;
  subscribePurchases?: (handlers: StorePurchaseHandlers) => () => void;
  ensureReady?: () => Promise<void>;
};

function hasPurchaseToken(value: unknown): boolean {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const item = value as { purchaseToken?: string; transactionId?: string };
  return Boolean(item.purchaseToken || item.transactionId);
}

export function waitForStorePurchase(options: {
  trigger: () => Promise<unknown>;
  subscribe: (handlers: StorePurchaseHandlers) => () => void;
}): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (fn: () => void) => {
      if (settled) {
        return;
      }
      settled = true;
      unsubscribe();
      fn();
    };

    const unsubscribe = options.subscribe({
      onPurchase: (purchase) => finish(() => resolve(purchase)),
      onError: (error) =>
        finish(() => reject(error instanceof Error ? error : new Error(String(error)))),
    });

    options
      .trigger()
      .then((result) => {
        const item = Array.isArray(result) ? result[0] : result;
        if (hasPurchaseToken(item)) {
          finish(() => resolve(item));
        }
      })
      .catch((error) => {
        finish(() => reject(error));
      });
  });
}

function mapStorePurchase(
  purchase: unknown,
  fallbackProductId: string,
  platform: SubscriptionPlatform,
): IapPurchaseResult {
  const item = purchase as {
    productId?: string;
    purchaseToken?: string;
    transactionId?: string;
    id?: string;
  };
  return {
    productId: String(item.productId ?? item.id ?? fallbackProductId),
    purchaseToken: String(item.purchaseToken ?? item.transactionId ?? item.id ?? ''),
    platform,
  };
}

export function createExpoIapProviderFromHook(hook: ExpoIapHook): IapProvider {
  const platform = resolvePlatform();
  const purchasesByToken = new Map<string, unknown>();

  return {
    async fetchProducts(productIds) {
      await hook.ensureReady?.();
      const products = await hook.fetchProducts({ skus: productIds, type: 'subs' });
      if (!Array.isArray(products)) {
        throw new Error('IAP fetchProducts deve retornar a lista da loja');
      }
      return products.map((product, index) =>
        mapStoreProductToIapProduct(
          product as Parameters<typeof mapStoreProductToIapProduct>[0],
          productIds[index] ?? productIds[0],
        ),
      );
    },
    async requestPurchase(productId, accountId, offerToken) {
      await hook.ensureReady?.();
      const purchase = await waitForStorePurchase({
        trigger: () =>
          hook.requestPurchase({
            type: 'subs',
            request:
              platform === 'IOS'
                ? { apple: { sku: productId } }
                : {
                    google: {
                      skus: [productId],
                      obfuscatedAccountId: accountId,
                      subscriptionOffers: offerToken ? [{ sku: productId, offerToken }] : [],
                    },
                  },
          }),
        subscribe: hook.subscribePurchases ?? (() => () => undefined),
      });
      const mapped = mapStorePurchase(purchase, productId, platform);
      purchasesByToken.set(mapped.purchaseToken, purchase);
      return mapped;
    },
    async restorePurchases() {
      await hook.ensureReady?.();
      const purchases = (await hook.getAvailablePurchases()) ?? [];
      return purchases.map((purchase) => {
        const mapped = mapStorePurchase(purchase, '', platform);
        purchasesByToken.set(mapped.purchaseToken, purchase);
        return mapped;
      });
    },
    async finishTransaction(purchaseToken) {
      const purchase = purchasesByToken.get(purchaseToken) ?? { purchaseToken };
      await hook.finishTransaction({
        purchase,
        isConsumable: false,
      });
      purchasesByToken.delete(purchaseToken);
    },
  };
}
