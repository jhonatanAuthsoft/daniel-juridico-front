import { render } from '@testing-library/react-native';

import Index from '@/app/index';

const mockUseAuth = jest.fn();

jest.mock('expo-router', () => ({
  Redirect: ({ href }: { href: string }) => {
    const { Text } = require('react-native');
    return <Text>{`redirect:${href}`}</Text>;
  },
}));

jest.mock('@/domain/auth', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('@/app/signup/subscription', () => {
  const { Text } = require('react-native');
  return {
    __esModule: true,
    default: () => <Text>subscription-screen</Text>,
  };
});

describe('Index', () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
  });

  it('does not redirect while the session is hydrating', () => {
    mockUseAuth.mockReturnValue({
      isHydrating: true,
      isAuthenticated: false,
      homeHref: '/login',
    });

    const screen = render(<Index />);

    expect(screen.queryByText('redirect:/login')).toBeNull();
    expect(screen.queryByText('redirect:/client')).toBeNull();
    expect(screen.queryByText('redirect:/lawyer')).toBeNull();
    expect(screen.queryByText('subscription-screen')).toBeNull();
  });

  it('sends a logged-out session to login', () => {
    mockUseAuth.mockReturnValue({
      isHydrating: false,
      isAuthenticated: false,
      homeHref: '/login',
    });

    const screen = render(<Index />);

    expect(screen.getByText('redirect:/login')).toBeTruthy();
    expect(screen.queryByText('subscription-screen')).toBeNull();
  });

  it('sends an authenticated client to the client home', () => {
    mockUseAuth.mockReturnValue({
      isHydrating: false,
      isAuthenticated: true,
      homeHref: '/client',
    });

    const screen = render(<Index />);

    expect(screen.getByText('redirect:/client')).toBeTruthy();
  });

  it('sends an authenticated lawyer to the lawyer home', () => {
    mockUseAuth.mockReturnValue({
      isHydrating: false,
      isAuthenticated: true,
      homeHref: '/lawyer',
    });

    const screen = render(<Index />);

    expect(screen.getByText('redirect:/lawyer')).toBeTruthy();
  });
});
