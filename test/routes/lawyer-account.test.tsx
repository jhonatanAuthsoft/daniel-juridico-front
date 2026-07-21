import { fireEvent, render } from '@testing-library/react-native';

import LawyerPerfilScreen from '@/app/lawyer/(tabs)/perfil';

const mockReplace = jest.fn();
const mockSignOut = jest.fn();

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
    signOut: mockSignOut,
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

describe('LawyerPerfilScreen', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockSignOut.mockClear();
  });

  it('shows the lawyer account screen', () => {
    const screen = render(<LawyerPerfilScreen />);

    expect(screen.getByText('Conta')).toBeTruthy();
    expect(screen.getByText('Luiza Bittencourt')).toBeTruthy();
    expect(screen.getByText('luizabitt@gmail.com')).toBeTruthy();
    expect(screen.getByTestId('profile-image')).toBeTruthy();
    expect(screen.getByText('Editar Dados')).toBeTruthy();
    expect(screen.getByText('Alterar Senha')).toBeTruthy();
    expect(screen.getByText('Assinatura e plano')).toBeTruthy();
    expect(screen.getByText('Termos e condições')).toBeTruthy();
    expect(screen.getByText('Notificações')).toBeTruthy();
    expect(screen.getByText('Tornar Perfil indisponível')).toBeTruthy();
  });

  it('toggles notifications and profile availability', () => {
    const screen = render(<LawyerPerfilScreen />);

    fireEvent(
      screen.getByRole('switch', { name: 'Notificações' }),
      'valueChange',
      false,
    );
    fireEvent(
      screen.getByRole('switch', { name: 'Tornar Perfil indisponível' }),
      'valueChange',
      false,
    );

    expect(
      screen.getByRole('switch', { name: 'Notificações' }),
    ).toHaveProp('value', false);
    expect(
      screen.getByRole('switch', { name: 'Tornar Perfil indisponível' }),
    ).toHaveProp('value', false);
  });

  it('signs out and returns to login', () => {
    const screen = render(<LawyerPerfilScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Sair da conta' }));

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith('/login');
  });
});
