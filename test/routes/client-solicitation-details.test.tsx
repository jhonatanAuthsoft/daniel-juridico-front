import { fireEvent, render } from '@testing-library/react-native';

import ClientSolicitationDetailsScreen from '@/app/client/solicitacao/[id]';

const mockBack = jest.fn();
const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: 'sol-1' }),
  useRouter: () => ({ back: mockBack, push: mockPush }),
}));

describe('ClientSolicitationDetailsScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockPush.mockClear();
  });

  it('assembles the client-only solicitation detail screen', () => {
    const screen = render(<ClientSolicitationDetailsScreen />);

    expect(screen.getByText('Visualizar Solicitação')).toBeTruthy();
    expect(screen.getByText('Dados da solicitação')).toBeTruthy();
    expect(screen.getByText('Descrição da solicitação')).toBeTruthy();
    expect(screen.getByText('Advogados compatíveis')).toBeTruthy();
  });

  it('opens and closes the cancellation confirmation', () => {
    const screen = render(<ClientSolicitationDetailsScreen />);

    fireEvent.press(
      screen.getByRole('button', { name: 'Cancelar solicitação' }),
    );

    expect(screen.getByText('Deseja cancelar a solicitação?')).toBeTruthy();
    expect(screen.getByTestId('info-alert-icon')).toBeTruthy();
    expect(mockBack).not.toHaveBeenCalled();

    fireEvent.press(screen.getByRole('button', { name: 'Fechar' }));

    expect(screen.queryByText('Deseja cancelar a solicitação?')).toBeNull();
  });

  it('returns to the client list after confirming cancellation', () => {
    const screen = render(<ClientSolicitationDetailsScreen />);

    fireEvent.press(
      screen.getByRole('button', { name: 'Cancelar solicitação' }),
    );
    fireEvent.press(
      screen.getByRole('button', {
        name: 'Confirmar cancelamento da solicitação',
      }),
    );

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('opens a compatible lawyer in the client view', () => {
    const screen = render(<ClientSolicitationDetailsScreen />);

    fireEvent.press(
      screen.getByRole('button', {
        name: 'Visualizar perfil de Maria Gomes',
      }),
    );

    expect(mockPush).toHaveBeenCalledWith('/client/advogado/lawyer-1');
  });
});
