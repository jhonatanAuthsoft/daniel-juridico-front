import { fireEvent, render } from '@testing-library/react-native';

import ClientPerfilScreen from '@/app/client/(tabs)/perfil';

const mockReplace = jest.fn();
const mockSignOut = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('@/domain/auth', () => ({
  useAuth: () => ({
    user: {
      id: 'mock-client',
      name: 'Maria Silva Lima',
      email: 'maria_silvalima@gmail.com',
      role: 'CLIENT',
    },
    signOut: mockSignOut,
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

describe('ClientPerfilScreen', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockSignOut.mockClear();
  });

  it('shows the client account screen', () => {
    const screen = render(<ClientPerfilScreen />);

    expect(screen.getByText('Conta')).toBeTruthy();
    expect(screen.getByText('Maria Silva Lima')).toBeTruthy();
    expect(screen.getByText('maria_silvalima@gmail.com')).toBeTruthy();
    expect(screen.getByTestId('profile-image')).toBeTruthy();
    expect(screen.getByText('Editar Dados')).toBeTruthy();
    expect(screen.getByText('Alterar Senha')).toBeTruthy();
    expect(screen.getByText('Termos e condições')).toBeTruthy();
    expect(screen.getByText('Notificações')).toBeTruthy();
    expect(screen.queryByText('Assinatura e plano')).toBeNull();
    expect(screen.queryByText('Tornar Perfil indisponível')).toBeNull();
  });

  it('toggles notifications', () => {
    const screen = render(<ClientPerfilScreen />);

    fireEvent(
      screen.getByRole('switch', { name: 'Notificações' }),
      'valueChange',
      false,
    );

    expect(
      screen.getByRole('switch', { name: 'Notificações' }),
    ).toHaveProp('value', false);
  });

  it('signs out and returns to login', () => {
    const screen = render(<ClientPerfilScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Sair da conta' }));

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith('/login');
  });
});
