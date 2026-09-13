import { formatPaywallOfferMessage } from './trial-copy';

describe('formatPaywallOfferMessage', () => {
  it('advertises the first free month when the store offer is available', () => {
    expect(
      formatPaywallOfferMessage({
        hasFreeTrial: true,
        localizedPrice: 'R$ 35,00',
      }),
    ).toBe(
      '1º mês grátis, depois R$ 35,00/mês. Renova automaticamente. Cancele quando quiser.',
    );
  });

  it('shows only the recurring price when the user is not eligible for a trial', () => {
    expect(
      formatPaywallOfferMessage({
        hasFreeTrial: false,
        localizedPrice: 'R$ 35,00',
      }),
    ).toBe('R$ 35,00/mês. Renova automaticamente.');
  });
});
