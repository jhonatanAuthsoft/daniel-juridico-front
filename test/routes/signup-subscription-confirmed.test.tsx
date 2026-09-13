import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import SignupSubscriptionConfirmedScreen from '@/app/signup/subscription-confirmed';
import { authKeys } from '@/domain/auth';
import { subscriptionKeys } from '@/domain/subscription';

const mockReplace = jest.fn();
const mockSignInAs = jest.fn();
const mockUseAuth = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('@/domain/auth', () => ({
  authKeys: {
    all: ['auth'],
    me: () => ['auth', 'me'],
  },
  useAuth: () => mockUseAuth(),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

function wrap(ui: ReactNode, queryClient: QueryClient) {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe('SignupSubscriptionConfirmedScreen', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.useFakeTimers();
    mockReplace.mockClear();
    mockSignInAs.mockClear();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    mockUseAuth.mockReturnValue({
      signInAs: mockSignInAs,
      homeHref: '/lawyer',
      user: {
        id: 'real-lawyer',
        name: 'Ana Souza',
        email: 'ana@example.com',
        role: 'LAWYER',
        termsAccepted: true,
      },
      isAuthenticated: true,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not replace the authenticated lawyer with a mock user', () => {
    wrap(<SignupSubscriptionConfirmedScreen />, queryClient);

    expect(mockSignInAs).not.toHaveBeenCalled();
  });

  it('invalidates me and subscription caches after confirmation', () => {
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    wrap(<SignupSubscriptionConfirmedScreen />, queryClient);

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: authKeys.me() });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: subscriptionKeys.me(),
    });
  });

  it('redirects to the session home after the confirmation delay', () => {
    wrap(<SignupSubscriptionConfirmedScreen />, queryClient);

    act(() => {
      jest.advanceTimersByTime(2500);
    });

    expect(mockReplace).toHaveBeenCalledWith('/lawyer');
  });
});
