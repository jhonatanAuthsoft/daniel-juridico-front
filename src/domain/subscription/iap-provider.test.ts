import { createExpoIapProviderFromHook, waitForStorePurchase } from './iap-provider';

describe('waitForStorePurchase', () => {
  it('uses the purchase event when requestPurchase resolves without a token', async () => {
    const purchase = await waitForStorePurchase({
      trigger: async () => undefined,
      subscribe: ({ onPurchase }) => {
        queueMicrotask(() => {
          onPurchase({
            purchaseToken: 'header.payload.signature',
            productId: 'laweact_basic_mensal',
          });
        });
        return () => undefined;
      },
    });

    expect(purchase).toEqual({
      purchaseToken: 'header.payload.signature',
      productId: 'laweact_basic_mensal',
    });
  });

  it('uses the immediate return when the store already sent a token', async () => {
    const purchase = await waitForStorePurchase({
      trigger: async () => ({ purchaseToken: 'android-token' }),
      subscribe: () => () => undefined,
    });

    expect(purchase).toEqual({ purchaseToken: 'android-token' });
  });
});

describe('createExpoIapProviderFromHook', () => {
  const iosProduct = {
    id: 'laweact_basic_mensal',
    title: 'Plano Basic',
    description: 'Mensal',
    displayPrice: 'R$ 35,00',
    currency: 'BRL',
    introductoryPricePaymentModeIOS: 'free-trial',
    introductoryPriceNumberOfPeriodsIOS: '1',
    introductoryPriceSubscriptionPeriodIOS: 'month',
  };

  it('maps products returned by the store module (not the void useIAP hook)', async () => {
    const provider = createExpoIapProviderFromHook({
      fetchProducts: async () => [iosProduct],
      requestPurchase: async () => undefined,
      getAvailablePurchases: async () => [],
      finishTransaction: async () => undefined,
      subscribePurchases: () => () => undefined,
    });

    await expect(provider.fetchProducts(['laweact_basic_mensal'])).resolves.toEqual([
      expect.objectContaining({
        productId: 'laweact_basic_mensal',
        localizedPrice: 'R$ 35,00',
        hasFreeTrial: true,
        offerToken: null,
      }),
    ]);
  });

  it('waits for the purchase listener before validating on the server', async () => {
    const provider = createExpoIapProviderFromHook({
      fetchProducts: async () => [],
      requestPurchase: async () => undefined,
      getAvailablePurchases: async () => [],
      finishTransaction: async () => undefined,
      subscribePurchases: ({ onPurchase }) => {
        queueMicrotask(() => {
          onPurchase({
            purchaseToken: 'header.payload.signature',
            productId: 'laweact_basic_mensal',
          });
        });
        return () => undefined;
      },
    });

    await expect(
      provider.requestPurchase('laweact_basic_mensal', 'lawyer-1', null),
    ).resolves.toEqual({
      productId: 'laweact_basic_mensal',
      purchaseToken: 'header.payload.signature',
      platform: 'IOS',
    });
  });

  it('finishes the original store purchase object, not just the token', async () => {
    const finishTransaction = jest.fn().mockResolvedValue(undefined);
    const storePurchase = {
      id: 'tx-1',
      productId: 'laweact_basic_mensal',
      purchaseToken: 'header.payload.signature',
    };
    const provider = createExpoIapProviderFromHook({
      fetchProducts: async () => [],
      requestPurchase: async () => storePurchase,
      getAvailablePurchases: async () => [],
      finishTransaction,
      subscribePurchases: () => () => undefined,
    });

    await provider.requestPurchase('laweact_basic_mensal');
    await provider.finishTransaction('header.payload.signature');

    expect(finishTransaction).toHaveBeenCalledWith({
      purchase: storePurchase,
      isConsumable: false,
    });
  });
});
