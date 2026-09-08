/**
 * Paywall copy derived from the store offer, not from a local trial countdown.
 */
export function formatPaywallOfferMessage(params: {
  hasFreeTrial: boolean;
  localizedPrice: string;
}): string {
  if (params.hasFreeTrial) {
    return `1º mês grátis, depois ${params.localizedPrice}/mês. Renova automaticamente. Cancele quando quiser.`;
  }

  return `${params.localizedPrice}/mês. Renova automaticamente.`;
}
