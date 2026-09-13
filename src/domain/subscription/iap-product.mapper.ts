import type { IapProduct } from '@/data/subscription';

export const FREE_TRIAL_OFFER_TAG = 'free-trial';

type StorePricingPhase = {
  priceAmountMicros?: string | null;
  billingPeriod?: string | null;
  billingCycleCount?: number | null;
};

type StoreSubscriptionOffer = {
  offerTokenAndroid?: string | null;
  offerTagsAndroid?: (string | null)[] | null;
  paymentMode?: string | null;
  period?: { unit?: string | null; value?: number | null } | null;
  periodCount?: number | null;
  pricingPhasesAndroid?: { pricingPhaseList?: StorePricingPhase[] | null } | null;
};

export type StoreProductLike = {
  id?: string | null;
  productId?: string | null;
  title?: string | null;
  description?: string | null;
  displayPrice?: string | null;
  localizedPrice?: string | null;
  currency?: string | null;
  introductoryPricePaymentModeIOS?: string | null;
  introductoryPriceNumberOfPeriodsIOS?: string | null;
  introductoryPriceSubscriptionPeriodIOS?: string | null;
  subscriptionOffers?: StoreSubscriptionOffer[] | null;
};

function isZeroMicros(value: string | null | undefined): boolean {
  if (value == null || value === '') {
    return false;
  }
  return Number(value) === 0;
}

function labelForPeriod(count: number, unit: string | null | undefined): string {
  const normalized = (unit ?? 'month').toLowerCase();
  if (normalized.startsWith('d') || normalized === 'day') {
    return count === 1 ? '1 dia' : `${count} dias`;
  }
  if (normalized.startsWith('w') || normalized === 'week') {
    return count === 1 ? '1 semana' : `${count} semanas`;
  }
  if (normalized.startsWith('y') || normalized === 'year') {
    return count === 1 ? '1 ano' : `${count} anos`;
  }
  return count === 1 ? '1 mês' : `${count} meses`;
}

function labelFromIsoPeriod(period: string | null | undefined, cycles: number): string | null {
  if (!period) {
    return null;
  }
  const match = /^P(\d+)([DWMY])$/i.exec(period);
  if (!match) {
    return null;
  }
  const count = Number(match[1]) * Math.max(1, cycles);
  return labelForPeriod(count, match[2]);
}

function firstFreePhase(offer: StoreSubscriptionOffer): StorePricingPhase | null {
  const phases = offer.pricingPhasesAndroid?.pricingPhaseList ?? [];
  return phases.find((phase) => isZeroMicros(phase.priceAmountMicros)) ?? null;
}

function isFreeTrialOffer(offer: StoreSubscriptionOffer): boolean {
  const tags = offer.offerTagsAndroid ?? [];
  if (tags.some((tag) => tag === FREE_TRIAL_OFFER_TAG)) {
    return true;
  }
  if (offer.paymentMode === 'free-trial') {
    return true;
  }
  return firstFreePhase(offer) != null;
}

function trialLabelFromOffer(offer: StoreSubscriptionOffer): string | null {
  const freePhase = firstFreePhase(offer);
  if (freePhase) {
    return labelFromIsoPeriod(freePhase.billingPeriod, freePhase.billingCycleCount ?? 1);
  }
  if (offer.period?.unit) {
    return labelForPeriod(offer.periodCount ?? offer.period.value ?? 1, offer.period.unit);
  }
  return '1 mês';
}

function iosFreeTrial(product: StoreProductLike): { hasFreeTrial: boolean; freeTrialLabel: string | null } {
  if (product.introductoryPricePaymentModeIOS !== 'free-trial') {
    return { hasFreeTrial: false, freeTrialLabel: null };
  }
  const periods = Number(product.introductoryPriceNumberOfPeriodsIOS ?? 1);
  return {
    hasFreeTrial: true,
    freeTrialLabel: labelForPeriod(
      Number.isFinite(periods) && periods > 0 ? periods : 1,
      product.introductoryPriceSubscriptionPeriodIOS,
    ),
  };
}

export function mapStoreProductToIapProduct(
  product: StoreProductLike,
  fallbackProductId: string,
): IapProduct {
  const offers = product.subscriptionOffers ?? [];
  const freeTrialOffer = offers.find(isFreeTrialOffer) ?? null;
  const selectedOffer = freeTrialOffer ?? offers[0] ?? null;
  const ios = iosFreeTrial(product);
  const hasFreeTrial = ios.hasFreeTrial || freeTrialOffer != null;

  return {
    productId: String(product.id ?? product.productId ?? fallbackProductId),
    title: String(product.title ?? 'Plano Basic'),
    description: String(product.description ?? ''),
    localizedPrice: String(product.displayPrice ?? product.localizedPrice ?? ''),
    currency: String(product.currency ?? 'BRL'),
    hasFreeTrial,
    freeTrialLabel: ios.freeTrialLabel ?? (freeTrialOffer ? trialLabelFromOffer(freeTrialOffer) : null),
    offerToken: selectedOffer?.offerTokenAndroid ?? null,
  };
}
