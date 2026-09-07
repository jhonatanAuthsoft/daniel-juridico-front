import {
  formatPaywallTrialMessage,
  formatTrialRemainingMessage,
} from './trial-copy';

describe('formatTrialRemainingMessage', () => {
  it('returns null when the lawyer is not in trial', () => {
    expect(formatTrialRemainingMessage(false, 12)).toBeNull();
  });

  it('uses the plural form for more than one remaining day', () => {
    expect(formatTrialRemainingMessage(true, 12)).toBe(
      'Você tem 12 dias restantes no período de testes.',
    );
  });

  it('uses the singular form for one remaining day', () => {
    expect(formatTrialRemainingMessage(true, 1)).toBe(
      'Você tem 1 dia restante no período de testes.',
    );
  });

  it('covers a same-day local trial with zero remaining days', () => {
    expect(formatTrialRemainingMessage(true, 0)).toBe(
      'Menos de 1 dia restante no período de testes.',
    );
  });
});

describe('formatPaywallTrialMessage', () => {
  it('asks to subscribe when the trial has ended', () => {
    expect(formatPaywallTrialMessage(false, null)).toBe(
      'Seu período de testes terminou. Assine para continuar usando o app.',
    );
  });
});
