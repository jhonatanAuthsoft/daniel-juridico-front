import { QueryClient } from '@tanstack/react-query';

import type { MeResult } from '@/data/auth';
import { HttpError } from '@/data/http';
import { authKeys } from '@/domain/auth/auth.keys';

import {
  applySubscriptionAccessRevoked,
  isSubscriptionRequiredError,
} from './apply-subscription-access-revoked';

jest.mock('./subscription-cache', () => ({
  writeCachedSubscription: jest.fn().mockResolvedValue(undefined),
}));

function meWithAccess(accessGranted: boolean): MeResult {
  return {
    photoKey: null,
    pushNotificationsEnabled: true,
    profileUnavailable: false,
    clientProfile: null,
    lawyerProfile: null,
    subscription: {
      status: accessGranted ? 'TRIAL' : 'EXPIRADA',
      accessGranted,
      inTrial: accessGranted,
      trialEndsAt: null,
      trialDaysRemaining: accessGranted ? 0 : null,
      periodEndsAt: null,
      platform: null,
      productId: 'laweact_basic_mensal',
      autoRenewing: false,
    },
  };
}

describe('isSubscriptionRequiredError', () => {
  it('detects the interceptor error code', () => {
    const error = new HttpError('Assinatura necessária', 403, {
      success: false,
      errors: [{ code: 'SUBSCRIPTION_REQUIRED', detail: 'blocked' }],
    });

    expect(isSubscriptionRequiredError(error)).toBe(true);
  });

  it('ignores other API errors', () => {
    const error = new HttpError('Indisponível', 409, {
      success: false,
      errors: [{ code: 'LAWYER_UNAVAILABLE' }],
    });

    expect(isSubscriptionRequiredError(error)).toBe(false);
  });
});

describe('applySubscriptionAccessRevoked', () => {
  it('sets accessGranted to false so the guard can redirect', () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(authKeys.me(), meWithAccess(true));

    applySubscriptionAccessRevoked(queryClient);

    expect(queryClient.getQueryData<MeResult>(authKeys.me())?.subscription?.accessGranted).toBe(
      false,
    );
    expect(queryClient.getQueryData<MeResult>(authKeys.me())?.subscription?.inTrial).toBe(false);
  });
});
