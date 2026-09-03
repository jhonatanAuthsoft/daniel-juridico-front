import { mapSubscriptionWireToResult } from './subscription.mapper';

describe('mapSubscriptionWireToResult', () => {
  it('maps wire payload to domain result', () => {
    expect(
      mapSubscriptionWireToResult({
        status: 'TRIAL',
        acessoLiberado: true,
        emTrial: true,
        trialFimEm: '2026-10-01T00:00:00',
        diasRestantesTrial: 12,
        periodoFimEm: null,
        plataforma: null,
        ambiente: null,
        productId: 'laweact_basic_mensal',
        autoRenovacao: false,
      }),
    ).toEqual({
      status: 'TRIAL',
      accessGranted: true,
      inTrial: true,
      trialEndsAt: '2026-10-01T00:00:00',
      trialDaysRemaining: 12,
      periodEndsAt: null,
      platform: null,
      productId: 'laweact_basic_mensal',
      autoRenewing: false,
    });
  });
});
