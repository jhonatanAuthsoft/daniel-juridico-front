import { act, fireEvent, render } from '@testing-library/react-native';
import { RefreshControl } from 'react-native';

import LawyerHomeScreen from '@/app/lawyer/(tabs)/index';
import type { ConnectionResult } from '@/data/connection';

const mockPush = jest.fn();
const mockRefetch = jest.fn().mockResolvedValue(undefined);
const mockUseConnections = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

jest.mock('@/domain/connection', () => {
  const actual = jest.requireActual('@/domain/connection');
  return {
    ...actual,
    useConnections: (...args: unknown[]) => mockUseConnections(...args),
  };
});

function connection(
  overrides: Partial<ConnectionResult> = {},
): ConnectionResult {
  return {
    id: '1',
    solicitacaoId: 'sol-1',
    clienteId: 'cli-1',
    advogadoId: 'adv-1',
    status: 'PENDENTE',
    uiStatus: 'pending',
    criadoEm: '2026-08-30T12:00:00.000Z',
    decididoEm: null,
    canceladoEm: null,
    telefone: null,
    email: null,
    nomeAdvogado: null,
    nomeCliente: 'Maria Gomes',
    tituloSolicitacao: 'Demanda trabalhista',
    descricaoSolicitacao: null,
    urgencia: 'URGENTE',
    modalidade: null,
    especialidadeCodigo: null,
    subespecialidadeCodigo: null,
    experienciaMinimaMeses: null,
    uf: 'BA',
    cidade: 'Salvador',
    formaCobranca: null,
    clienteProfissao: null,
    clientePronomes: null,
    clienteEstadoCivil: null,
    clienteFaixaRenda: null,
    clienteFotoUrl: null,
    clienteCidade: null,
    clienteUf: null,
    clienteTelefone: null,
    clienteEmail: null,
    avaliacaoClienteNota: null,
    avaliacaoClienteComentario: null,
    ...overrides,
  };
}

function mockQuery(overrides: Record<string, unknown> = {}) {
  return {
    data: [connection()],
    isLoading: false,
    isError: false,
    refetch: mockRefetch,
    ...overrides,
  };
}

describe('LawyerHomeScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockRefetch.mockClear();
    mockUseConnections.mockImplementation(() => mockQuery());
  });

  it('shows the no-data state when no connections exist', () => {
    mockUseConnections.mockReturnValue(mockQuery({ data: [] }));
    const screen = render(<LawyerHomeScreen />);

    expect(screen.getByText('Nenhuma solicitação encontrada')).toBeTruthy();
  });

  it('shows search results heading and no-results state for an empty search', () => {
    const screen = render(<LawyerHomeScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Pesquisar' }));
    fireEvent.changeText(
      screen.getByPlaceholderText('Buscar pedido'),
      'cliente inexistente',
    );

    expect(screen.getByText('Seus resultados')).toBeTruthy();
    expect(screen.getByText('Sem resultados compatíveis')).toBeTruthy();
  });

  it('opens a client solicitation from a card', () => {
    const screen = render(<LawyerHomeScreen />);

    fireEvent.press(screen.getByText('Maria Gomes'));

    expect(mockPush).toHaveBeenCalledWith('/lawyer/solicitacao/1');
  });

  it('refetches from the list on pull-to-refresh without swapping to the loading screen', async () => {
    const screen = render(<LawyerHomeScreen />);

    expect(screen.getByText('Maria Gomes')).toBeTruthy();

    await act(async () => {
      fireEvent(screen.UNSAFE_getByType(RefreshControl), 'refresh');
    });

    expect(mockRefetch).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Maria Gomes')).toBeTruthy();
    expect(screen.getByText('Pedidos de conexão')).toBeTruthy();
  });

  it('refetches from the empty state on pull-to-refresh without swapping to the loading screen', async () => {
    mockUseConnections.mockReturnValue(mockQuery({ data: [] }));
    const screen = render(<LawyerHomeScreen />);

    expect(screen.getByText('Nenhuma solicitação encontrada')).toBeTruthy();

    await act(async () => {
      fireEvent(screen.UNSAFE_getByType(RefreshControl), 'refresh');
    });

    expect(mockRefetch).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Nenhuma solicitação encontrada')).toBeTruthy();
    expect(screen.getByText('Pedidos de conexão')).toBeTruthy();
  });
});
