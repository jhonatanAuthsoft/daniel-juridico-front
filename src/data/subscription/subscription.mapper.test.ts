import { mapSubscriptionWireToResult } from './subscription.mapper';

describe('mapSubscriptionWireToResult', () => {
  it('maps the pending paywall payload without local trial fields', () => {
    expect(
      mapSubscriptionWireToResult({
        status: 'PENDENTE',
        acessoLiberado: false,
        periodoFimEm: null,
        plataforma: null,
        ambiente: null,
        productId: 'laweact_basic_mensal',
        autoRenovacao: false,
      }),
    ).toEqual({
      status: 'PENDENTE',
      accessGranted: false,
      periodEndsAt: null,
      platform: null,
      productId: 'laweact_basic_mensal',
      autoRenewing: false,
    });
  });

  it('maps an active store subscription', () => {
    expect(
      mapSubscriptionWireToResult({
        status: 'ATIVA',
        acessoLiberado: true,
        periodoFimEm: '2026-10-08T12:00:00',
        plataforma: 'IOS',
        ambiente: 'SANDBOX',
        productId: 'laweact_basic_mensal',
        autoRenovacao: true,
      }),
    ).toEqual({
      status: 'ATIVA',
      accessGranted: true,
      periodEndsAt: '2026-10-08T12:00:00',
      platform: 'IOS',
      productId: 'laweact_basic_mensal',
      autoRenewing: true,
    });
  });
});
