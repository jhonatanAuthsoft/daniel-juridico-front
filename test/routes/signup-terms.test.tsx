import { fireEvent, render, waitFor } from '@testing-library/react-native';

import SignupTermsScreen from '@/app/signup/terms';

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockSignInAs = jest.fn();
const mockAcceptTerms = jest.fn().mockResolvedValue(undefined);
const mockUseAuth = jest.fn();
const mockParams: { profile?: string } = { profile: 'client' };

jest.mock('expo-router', () => ({
  Redirect: ({ href }: { href: string }) => {
    const { Text } = require('react-native');
    return <Text>{`redirect:${href}`}</Text>;
  },
  useLocalSearchParams: () => mockParams,
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

jest.mock('@/domain/auth', () => ({
  homeHrefForRole: (role: 'CLIENT' | 'LAWYER') =>
    role === 'LAWYER' ? '/lawyer' : '/client',
  useAcceptTerms: () => ({
    mutateAsync: mockAcceptTerms,
    isPending: false,
  }),
  useAuth: () => mockUseAuth(),
}));

jest.mock('@/atomic/feedback-banner', () => ({
  useBanner: () => jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

describe('SignupTermsScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockReplace.mockClear();
    mockSignInAs.mockClear();
    mockAcceptTerms.mockClear();
    mockParams.profile = 'client';
    mockUseAuth.mockReturnValue({
      signInAs: mockSignInAs,
      isAuthenticated: false,
      homeHref: '/login',
      user: null,
      isHydrating: false,
    });
  });

  it('does not sign in as a mock client when the session is missing', () => {
    const screen = render(<SignupTermsScreen />);

    fireEvent.press(screen.getByRole('checkbox'));
    fireEvent.press(screen.getByText('Começar'));

    expect(mockSignInAs).not.toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('/login');
  });

  it('does not sign in as a mock lawyer when the session is missing', () => {
    mockParams.profile = 'lawyer';
    const screen = render(<SignupTermsScreen />);

    fireEvent.press(screen.getByRole('checkbox'));
    fireEvent.press(screen.getByText('Começar'));

    expect(mockSignInAs).not.toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('/login');
  });

  it('records terms for the authenticated lawyer without inventing a mock user', async () => {
    mockParams.profile = 'lawyer';
    mockUseAuth.mockReturnValue({
      signInAs: mockSignInAs,
      isAuthenticated: true,
      homeHref: '/lawyer',
      user: {
        id: 'real-lawyer',
        name: 'Ana Souza',
        email: 'ana@example.com',
        role: 'LAWYER',
        termsAccepted: false,
      },
      isHydrating: false,
    });

    const screen = render(<SignupTermsScreen />);

    fireEvent.press(screen.getByRole('checkbox'));
    fireEvent.press(screen.getByText('Começar'));

    await waitFor(() => {
      expect(mockAcceptTerms).toHaveBeenCalledWith({
        checkboxConfirmed: true,
        scrollConfirmed: true,
      });
    });
    expect(mockSignInAs).not.toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/signup/subscription');
  });
});
