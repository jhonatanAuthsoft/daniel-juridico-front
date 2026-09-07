/**
 * In-app copy while the lawyer trial is still open.
 * Returns null when the user is not in trial (paywall / paid plan).
 */
export function formatTrialRemainingMessage(
  inTrial: boolean,
  daysRemaining: number | null | undefined,
): string | null {
  if (!inTrial) {
    return null;
  }

  if (daysRemaining != null && daysRemaining > 1) {
    return `Você tem ${daysRemaining} dias restantes no período de testes.`;
  }

  if (daysRemaining === 1) {
    return 'Você tem 1 dia restante no período de testes.';
  }

  return 'Menos de 1 dia restante no período de testes.';
}

export function formatPaywallTrialMessage(
  inTrial: boolean,
  daysRemaining: number | null | undefined,
): string {
  return (
    formatTrialRemainingMessage(inTrial, daysRemaining) ??
    'Seu período de testes terminou. Assine para continuar usando o app.'
  );
}
