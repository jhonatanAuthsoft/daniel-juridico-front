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

export function createExpoIapProviderFromHook(
  hook: {
    fetchProducts: (params: { skus: string[]; type: 'subs' }) => Promise<unknown[] | undefined>;
    requestPurchase: (params: {
      type: 'subs';
      request: {
        ios?: { sku: string };
        android?: {
          skus: string[];
          obfuscatedAccountId?: string;
          subscriptionOffers?: { sku: string; offerToken: string }[];
        };
      };
    }) => Promise<unknown>;
    getAvailablePurchases: () => Promise<unknown[] | undefined>;
    finishTransaction: (params: { purchase: unknown; isConsumable: boolean }) => Promise<void>;
  },
): IapProvider {
  const platform = resolvePlatform();

  return {
    async fetchProducts(productIds) {
      const products = (await hook.fetchProducts({ skus: productIds, type: 'subs' })) ?? [];
      return products.map((product, index) =>
        mapStoreProductToIapProduct(
          product as Parameters<typeof mapStoreProductToIapProduct>[0],
          productIds[index] ?? productIds[0],
        ),
      );
    },
    async requestPurchase(productId, accountId, offerToken) {
      const purchase = await hook.requestPurchase({
        type: 'subs',
        request:
          platform === 'IOS'
            ? { ios: { sku: productId } }
            : {
                android: {
                  skus: [productId],
                  obfuscatedAccountId: accountId,
                  subscriptionOffers: offerToken ? [{ sku: productId, offerToken }] : [],
                },
              },
      });
      const item = purchase as {
        purchaseToken?: string;
        transactionId?: string;
        id?: string;
      };
      return {
        productId,
        purchaseToken: String(item.purchaseToken ?? item.transactionId ?? item.id ?? ''),
        platform,
      };
    },
    async restorePurchases() {
      const purchases = (await hook.getAvailablePurchases()) ?? [];
      return purchases.map((purchase) => {
        const item = purchase as {
          productId?: string;
          purchaseToken?: string;
          transactionId?: string;
          id?: string;
        };
        return {
          productId: String(item.productId ?? item.id ?? ''),
          purchaseToken: String(item.purchaseToken ?? item.transactionId ?? item.id ?? ''),
          platform,
        };
      });
    },
    async finishTransaction(purchaseToken) {
      await hook.finishTransaction({
        purchase: { purchaseToken },
        isConsumable: false,
      });
    },
  };
}
