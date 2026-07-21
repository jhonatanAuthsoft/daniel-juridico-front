import { fireEvent, render } from '@testing-library/react-native';

import ClientNotificacoesScreen from '@/app/client/(tabs)/notificacoes';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

describe('ClientNotificacoesScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
  });

  it('shows the inbox with example notifications', () => {
    const screen = render(<ClientNotificacoesScreen />);

    expect(screen.getByText('Caixa de entrada')).toBeTruthy();
    expect(screen.getAllByTestId('notification-card')).toHaveLength(3);
    expect(screen.getByText('26/08/2026')).toBeTruthy();
    expect(screen.getByText('Dra. Mariana está disponível')).toBeTruthy();
    expect(screen.getByText('Dra. Mariana recusou seu pedido')).toBeTruthy();
    expect(screen.getByText('Advogados compatíveis')).toBeTruthy();
    expect(
      screen.getByText(/Seu pedido foi aceito\. Você já pode entrar em contato/),
    ).toBeTruthy();
    expect(
      screen.getByText(/Seu pedido foi recusado\. Entre em contato com outros/),
    ).toBeTruthy();
    expect(
      screen.getByText(/Encontramos 2 advogados compatíveis/),
    ).toBeTruthy();
  });

  it('returns when pressing back', () => {
    const screen = render(<ClientNotificacoesScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Voltar' }));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
