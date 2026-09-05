import { act, render } from '@testing-library/react-native';

import SignupSubscriptionConfirmedScreen from '@/app/signup/subscription-confirmed';

const mockReplace = jest.fn();
const mockSignInAs = jest.fn();
const mockUseAuth = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('@/domain/auth', () => ({
  homeHrefForRole: (role: 'CLIENT' | 'LAWYER') =>
    role === 'LAWYER' ? '/lawyer' : '/client',
  useAuth: () => mockUseAuth(),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

describe('SignupSubscriptionConfirmedScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockReplace.mockClear();
    mockSignInAs.mockClear();
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
    render(<SignupSubscriptionConfirmedScreen />);

    expect(mockSignInAs).not.toHaveBeenCalled();
  });

  it('redirects to the session home after the confirmation delay', () => {
    render(<SignupSubscriptionConfirmedScreen />);

    act(() => {
      jest.advanceTimersByTime(2500);
    });

    expect(mockReplace).toHaveBeenCalledWith('/lawyer');
  });
});
