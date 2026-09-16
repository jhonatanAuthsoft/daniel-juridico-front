export const FALLBACK_PLAN_NAME = 'Básico';
export const FALLBACK_LOCALIZED_PRICE = 'R$ 50,00';
export const DEFAULT_SUBSCRIPTION_PRODUCT_ID = 'laweact_basic_mensal';

const PLAN_NAMES: Record<string, string> = {
  laweact_basic_mensal: 'Básico',
};

export function planDisplayName(productId: string, storeTitle?: string | null): string {
  const mapped = PLAN_NAMES[productId];
  if (mapped) {
    return mapped;
  }

  const title = storeTitle?.trim();
  if (!title) {
    return FALLBACK_PLAN_NAME;
  }

  return title.replace(/^Laweact\s+/i, '').replace(/^Plano\s+/i, '') || FALLBACK_PLAN_NAME;
}

export function formatPlanMonthlyPrice(localizedPrice: string): string {
  const trimmed = localizedPrice.trim();
  if (!trimmed) {
    return formatPlanMonthlyPrice(FALLBACK_LOCALIZED_PRICE);
  }
  if (/\/\s*mês/i.test(trimmed)) {
    return trimmed.replace(/\/\s*mês/i, '/mês');
  }

  return `${trimmed.replace(/,00(?!\d)/, '')} /mês`;
}

export function formatSubscriptionDate(iso: string | null | undefined): string | null {
  const text = iso?.trim();
  if (!text) {
    return null;
  }

  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})/.exec(text);
  if (dateOnly) {
    const [, year, month, day] = dateOnly;
    return `${day}/${month}/${year}`;
  }

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString('pt-BR');
}

export function subscriptionValidityValue(periodEndsAt: string | null | undefined): string {
  return formatSubscriptionDate(periodEndsAt) ?? '—';
}

export function subscriptionRenewalValue(params: {
  periodEndsAt: string | null | undefined;
  autoRenewing: boolean;
}): string {
  if (!params.autoRenewing) {
    return 'Não será renovada';
  }

  return formatSubscriptionDate(params.periodEndsAt) ?? '—';
}

export function subscriptionStoreActionLabel(autoRenewing: boolean): string {
  return autoRenewing ? 'Cancelar assinatura' : 'Ver na loja';
}
