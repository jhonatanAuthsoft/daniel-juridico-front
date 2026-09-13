import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { RoleGuard } from './role-guard';

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

describe('RoleGuard', () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
  });

  it('does not render the home while the session is hydrating', () => {
    mockUseAuth.mockReturnValue({
      isHydrating: true,
      isAuthenticated: false,
      user: null,
    });

    const screen = render(
      <RoleGuard allowedRole="CLIENT">
        <Text>client-home</Text>
      </RoleGuard>,
    );

    expect(screen.queryByText('client-home')).toBeNull();
    expect(screen.queryByText('redirect:/login')).toBeNull();
  });

  it('sends a logged-out session to login', () => {
    mockUseAuth.mockReturnValue({
      isHydrating: false,
      isAuthenticated: false,
      user: null,
    });

    const screen = render(
      <RoleGuard allowedRole="CLIENT">
        <Text>client-home</Text>
      </RoleGuard>,
    );

    expect(screen.getByText('redirect:/login')).toBeTruthy();
    expect(screen.queryByText('client-home')).toBeNull();
  });

  it('renders the matching authenticated home', () => {
    mockUseAuth.mockReturnValue({
      isHydrating: false,
      isAuthenticated: true,
      user: { role: 'CLIENT' },
    });

    const screen = render(
      <RoleGuard allowedRole="CLIENT">
        <Text>client-home</Text>
      </RoleGuard>,
    );

    expect(screen.getByText('client-home')).toBeTruthy();
  });
});
