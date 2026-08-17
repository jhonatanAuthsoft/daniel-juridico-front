import { fireEvent, render } from '@testing-library/react-native';

import LawyerPerfilScreen from '@/app/lawyer/(tabs)/perfil';

const mockReplace = jest.fn();
const mockSignOut = jest.fn().mockResolvedValue(undefined);

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('@/domain/auth', () => ({
  useAuth: () => ({
    user: {
      id: 'mock-lawyer',
      name: 'Luiza Bittencourt',
      email: 'luizabitt@gmail.com',
      role: 'LAWYER',
    },
    isAuthenticated: true,
    signOut: mockSignOut,
  }),
  useMe: () => ({
    data: { photoKey: null },
    isLoading: false,
  }),
}));

jest.mock('@/domain/arquivo', () => ({
  useObjectReadUrl: () => ({
    data: undefined,
    isLoading: false,
  }),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

jest.mock('@/components/splash-guard', () => ({
  useSplashGate: () => ({ markContentReady: jest.fn() }),
}));

describe('LawyerPerfilScreen', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockSignOut.mockClear();
  });

  it('shows the under-development guard instead of the account screen', () => {
    const screen = render(<LawyerPerfilScreen />);

    expect(screen.getByLabelText('Aplicativo em desenvolvimento')).toBeTruthy();
    expect(screen.getByText('Em desenvolvimento')).toBeTruthy();
    expect(screen.queryByText('Conta')).toBeNull();
    expect(screen.queryByText('Editar Dados')).toBeNull();
  });

  it('signs out and returns to login', () => {
    const screen = render(<LawyerPerfilScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Voltar ao login' }));

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
