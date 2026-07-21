import { fireEvent, render } from '@testing-library/react-native';

import LawyerNotificacoesScreen from '@/app/lawyer/(tabs)/notificacoes';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

describe('LawyerNotificacoesScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
  });

  it('shows the inbox with example notifications', () => {
    const screen = render(<LawyerNotificacoesScreen />);

    expect(screen.getByText('Caixa de entrada')).toBeTruthy();
    expect(screen.getAllByTestId('notification-card')).toHaveLength(3);
    expect(screen.getByText('26/08/2026')).toBeTruthy();
    expect(screen.getAllByText('Demanda urgente')).toHaveLength(2);
    expect(screen.getByText('Nova solicitação de conexão')).toBeTruthy();
    expect(
      screen.getByText(
        /Maria precisa falar com um advogado com URGÊNCIA/,
      ),
    ).toBeTruthy();
    expect(
      screen.getByText(/Joana solicita uma consulta jurídica/),
    ).toBeTruthy();
    expect(
      screen.getByText(/Pedro precisa de orientação legal URGENTE/),
    ).toBeTruthy();
  });

  it('returns when pressing back', () => {
    const screen = render(<LawyerNotificacoesScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Voltar' }));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
