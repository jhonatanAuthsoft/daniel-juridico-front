import { fireEvent, render } from '@testing-library/react-native';

import LawyerNotificacoesScreen from '@/app/lawyer/(tabs)/notificacoes';

const mockReplace = jest.fn();
const mockSignOut = jest.fn().mockResolvedValue(undefined);

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

jest.mock('@/domain/auth', () => ({
  useAuth: () => ({
    signOut: mockSignOut,
    isAuthenticated: true,
  }),
}));

jest.mock('@/components/splash-guard', () => ({
  useSplashGate: () => ({ markContentReady: jest.fn() }),
}));

describe('LawyerNotificacoesScreen', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockSignOut.mockClear();
  });

  it('shows the under-development guard instead of the inbox', () => {
    const screen = render(<LawyerNotificacoesScreen />);

    expect(screen.getByLabelText('Aplicativo em desenvolvimento')).toBeTruthy();
    expect(screen.getByText('Em desenvolvimento')).toBeTruthy();
    expect(screen.queryByText('Caixa de entrada')).toBeNull();
  });

  it('signs out and returns to login', () => {
    const screen = render(<LawyerNotificacoesScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Voltar ao login' }));

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
