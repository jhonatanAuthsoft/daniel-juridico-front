import { mapStoreProductToIapProduct } from './iap-product.mapper';

describe('mapStoreProductToIapProduct', () => {
  it('marks an iOS introductory free trial as eligible', () => {
    expect(
      mapStoreProductToIapProduct(
        {
          id: 'laweact_basic_mensal',
          title: 'Plano Basic',
          description: 'Mensal',
          displayPrice: 'R$ 35,00',
          currency: 'BRL',
          introductoryPricePaymentModeIOS: 'free-trial',
          introductoryPriceNumberOfPeriodsIOS: '1',
          introductoryPriceSubscriptionPeriodIOS: 'month',
        },
        'laweact_basic_mensal',
      ),
    ).toEqual({
      productId: 'laweact_basic_mensal',
      title: 'Plano Basic',
      description: 'Mensal',
      localizedPrice: 'R$ 35,00',
      currency: 'BRL',
      hasFreeTrial: true,
      freeTrialLabel: '1 mês',
      offerToken: null,
    });
  });

  it('picks the Android free-trial offer token by tag', () => {
    const product = mapStoreProductToIapProduct(
      {
        id: 'laweact_basic_mensal',
        title: 'Plano Basic',
        displayPrice: 'R$ 35,00',
        currency: 'BRL',
        subscriptionOffers: [
          {
            id: 'monthly',
            displayPrice: 'R$ 35,00',
            offerTokenAndroid: 'base-token',
            offerTagsAndroid: ['monthly-base-plan'],
            pricingPhasesAndroid: {
              pricingPhaseList: [
                { priceAmountMicros: '35000000', billingPeriod: 'P1M', billingCycleCount: 0 },
              ],
            },
          },
          {
            id: 'monthly-free-trial',
            displayPrice: 'Grátis',
            offerTokenAndroid: 'trial-token',
            offerTagsAndroid: ['free-trial'],
            paymentMode: 'free-trial',
            pricingPhasesAndroid: {
              pricingPhaseList: [
                { priceAmountMicros: '0', billingPeriod: 'P1M', billingCycleCount: 1 },
                { priceAmountMicros: '35000000', billingPeriod: 'P1M', billingCycleCount: 0 },
              ],
            },
          },
        ],
      },
      'laweact_basic_mensal',
    );

    expect(product.hasFreeTrial).toBe(true);
    expect(product.freeTrialLabel).toBe('1 mês');
    expect(product.offerToken).toBe('trial-token');
  });

  it('falls back to the base plan token when the user is not eligible', () => {
    const product = mapStoreProductToIapProduct(
      {
        id: 'laweact_basic_mensal',
        displayPrice: 'R$ 35,00',
        currency: 'BRL',
        subscriptionOffers: [
          {
            id: 'monthly',
            displayPrice: 'R$ 35,00',
            offerTokenAndroid: 'base-token',
            offerTagsAndroid: ['monthly-base-plan'],
            pricingPhasesAndroid: {
              pricingPhaseList: [
                { priceAmountMicros: '35000000', billingPeriod: 'P1M', billingCycleCount: 0 },
              ],
            },
          },
        ],
      },
      'laweact_basic_mensal',
    );

    expect(product.hasFreeTrial).toBe(false);
    expect(product.freeTrialLabel).toBeNull();
    expect(product.offerToken).toBe('base-token');
  });
});
