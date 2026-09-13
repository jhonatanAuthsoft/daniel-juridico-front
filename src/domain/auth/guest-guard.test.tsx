import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { GuestGuard } from './guest-guard';

const mockUseAuth = jest.fn();

jest.mock('expo-router', () => ({
  Redirect: ({ href }: { href: string }) => {
    const { Text: RedirectText } = require('react-native');
    return <RedirectText>{`redirect:${href}`}</RedirectText>;
  },
}));

jest.mock('./auth-provider', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('GuestGuard', () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
  });

  it('does not render guest screens while the session is hydrating', () => {
    mockUseAuth.mockReturnValue({
      isHydrating: true,
      isAuthenticated: false,
      homeHref: '/login',
    });

    const screen = render(
      <GuestGuard>
        <Text>guest-screen</Text>
      </GuestGuard>,
    );

    expect(screen.queryByText('guest-screen')).toBeNull();
    expect(screen.queryByText('redirect:/login')).toBeNull();
    expect(screen.queryByText('redirect:/client')).toBeNull();
  });

  it('renders guest screens when the user is logged out', () => {
    mockUseAuth.mockReturnValue({
      isHydrating: false,
      isAuthenticated: false,
      homeHref: '/login',
    });

    const screen = render(
      <GuestGuard>
        <Text>guest-screen</Text>
      </GuestGuard>,
    );

    expect(screen.getByText('guest-screen')).toBeTruthy();
  });

  it('sends an authenticated user to their home', () => {
    mockUseAuth.mockReturnValue({
      isHydrating: false,
      isAuthenticated: true,
      homeHref: '/lawyer',
    });

    const screen = render(
      <GuestGuard>
        <Text>guest-screen</Text>
      </GuestGuard>,
    );

    expect(screen.getByText('redirect:/lawyer')).toBeTruthy();
    expect(screen.queryByText('guest-screen')).toBeNull();
  });
});
