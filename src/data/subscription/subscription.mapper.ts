import type { SubscriptionResult, SubscriptionWire } from './subscription.types';

const DEFAULT_PRODUCT_ID = 'laweact_basic_mensal';

export function mapSubscriptionWireToResult(wire: SubscriptionWire): SubscriptionResult {
  return {
    status: wire.status,
    accessGranted: wire.acessoLiberado,
    inTrial: wire.emTrial,
    trialEndsAt: wire.trialFimEm?.trim() || null,
    trialDaysRemaining:
      typeof wire.diasRestantesTrial === 'number' ? wire.diasRestantesTrial : null,
    periodEndsAt: wire.periodoFimEm?.trim() || null,
    platform: wire.plataforma ?? null,
    productId: wire.productId?.trim() || DEFAULT_PRODUCT_ID,
    autoRenewing: wire.autoRenovacao,
  };
}

export function mapSubscriptionWireToResultOrNull(
  wire: SubscriptionWire | null | undefined,
): SubscriptionResult | null {
  if (!wire) {
    return null;
  }
  return mapSubscriptionWireToResult(wire);
}
