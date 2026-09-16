import {
  FALLBACK_PLAN_NAME,
  formatPlanMonthlyPrice,
  formatSubscriptionDate,
  planDisplayName,
  subscriptionRenewalValue,
  subscriptionStoreActionLabel,
  subscriptionValidityValue,
} from './subscription-plan.mapper';

describe('subscription-plan.mapper', () => {
  it('maps the basic monthly product to Básico', () => {
    expect(planDisplayName('laweact_basic_mensal', 'Plano Basic')).toBe('Básico');
  });

  it('falls back to the store title without the brand prefix', () => {
    expect(planDisplayName('outro_plano', 'Laweact Premium')).toBe('Premium');
  });

  it('falls back to Básico when there is no mapped name or title', () => {
    expect(planDisplayName('desconhecido')).toBe(FALLBACK_PLAN_NAME);
  });

  it('formats the monthly price like the account screen', () => {
    expect(formatPlanMonthlyPrice('R$ 50,00')).toBe('R$ 50 /mês');
    expect(formatPlanMonthlyPrice('R$ 50 /mês')).toBe('R$ 50 /mês');
    expect(formatPlanMonthlyPrice('')).toBe('R$ 50 /mês');
  });

  it('formats validity dates from ISO without timezone drift', () => {
    expect(formatSubscriptionDate('2026-10-08T12:00:00')).toBe('08/10/2026');
    expect(formatSubscriptionDate('   ')).toBeNull();
  });

  it('shows the period end as validity and renewal when auto-renewing', () => {
    expect(subscriptionValidityValue('2026-10-08T12:00:00')).toBe('08/10/2026');
    expect(
      subscriptionRenewalValue({
        periodEndsAt: '2026-10-08T12:00:00',
        autoRenewing: true,
      }),
    ).toBe('08/10/2026');
  });

  it('says the plan will not renew after cancellation', () => {
    expect(
      subscriptionRenewalValue({
        periodEndsAt: '2026-10-08T12:00:00',
        autoRenewing: false,
      }),
    ).toBe('Não será renovada');
    expect(subscriptionValidityValue(null)).toBe('—');
  });

  it('sends auto-renewing plans to cancel and others to view in the store', () => {
    expect(subscriptionStoreActionLabel(true)).toBe('Cancelar assinatura');
    expect(subscriptionStoreActionLabel(false)).toBe('Ver na loja');
  });
});
