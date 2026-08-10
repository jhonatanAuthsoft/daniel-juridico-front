import { fireEvent, render, waitFor } from '@testing-library/react-native';

import ClientSolicitationDetailsScreen from '@/app/client/solicitacao/[id]';
import { MOCK_CLIENT_SOLICITATION_DETAILS } from '@/components/client-solicitation-details';

const mockBack = jest.fn();
const mockPush = jest.fn();
const mockMutateAsync = jest.fn().mockResolvedValue(undefined);
const mockUseClientSolicitationDetails = jest.fn();

const awaitingDetails = MOCK_CLIENT_SOLICITATION_DETAILS.find(
  (item) => item.workflowStatus === 'AGUARDANDO_MATCHING',
)!;
const matchedDetails = MOCK_CLIENT_SOLICITATION_DETAILS.find(
  (item) => item.workflowStatus === 'MATCH_REALIZADO',
)!;

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: 'sol-1' }),
  useRouter: () => ({ back: mockBack, push: mockPush }),
}));

jest.mock('@/domain/solicitation', () => ({
  useClientSolicitationDetails: (...args: unknown[]) =>
    mockUseClientSolicitationDetails(...args),
  useCancelClientSolicitation: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

jest.mock('@/domain/connection', () => ({
  useSolicitationConnections: () => ({ data: [] }),
  useCreateConnection: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
    variables: undefined,
  }),
}));

describe('ClientSolicitationDetailsScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockPush.mockClear();
    mockMutateAsync.mockClear();
    mockUseClientSolicitationDetails.mockReturnValue({
      solicitation: awaitingDetails,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });
  });

  it('assembles the client-only solicitation detail screen', () => {
    const screen = render(<ClientSolicitationDetailsScreen />);

    expect(screen.getByText('Visualizar Solicitação')).toBeTruthy();
    expect(screen.getByText('Dados da solicitação')).toBeTruthy();
    expect(screen.getByText('Descrição da solicitação')).toBeTruthy();
    expect(screen.getByText('Advogados compatíveis')).toBeTruthy();
  });

  it('shows cancel only while AGUARDANDO_MATCHING', () => {
    const awaitingScreen = render(<ClientSolicitationDetailsScreen />);
    expect(
      awaitingScreen.getByRole('button', { name: 'Cancelar solicitação' }),
    ).toBeTruthy();
    awaitingScreen.unmount();

    mockUseClientSolicitationDetails.mockReturnValue({
      solicitation: matchedDetails,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    const matchedScreen = render(<ClientSolicitationDetailsScreen />);
    expect(
      matchedScreen.queryByRole('button', { name: 'Cancelar solicitação' }),
    ).toBeNull();
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

  it('returns to the client list after confirming cancellation', async () => {
    const screen = render(<ClientSolicitationDetailsScreen />);

    fireEvent.press(
      screen.getByRole('button', { name: 'Cancelar solicitação' }),
    );
    fireEvent.press(
      screen.getByRole('button', {
        name: 'Confirmar cancelamento da solicitação',
      }),
    );

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith('sol-1');
      expect(mockBack).toHaveBeenCalledTimes(1);
    });
  });

  it('opens a compatible lawyer in the client view', () => {
    const screen = render(<ClientSolicitationDetailsScreen />);
    const lawyer = awaitingDetails.compatibleLawyers[0];

    fireEvent.press(
      screen.getByRole('button', {
        name: `Visualizar perfil de ${lawyer.name}`,
      }),
    );

    expect(mockPush).toHaveBeenCalledWith(
      `/client/advogado/${lawyer.id}?solicitacaoId=${encodeURIComponent(awaitingDetails.id)}`,
    );
  });
});
