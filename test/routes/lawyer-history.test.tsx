import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { RefreshControl } from 'react-native';

import LawyerHistoricoScreen from '@/app/lawyer/(tabs)/historico';
import {
  emptyConnectionStatusCounts,
  emptyConnectionUrgencyCounts,
  type ConnectionResult,
  type ConnectionStatusCounts,
} from '@/data/connection';

const mockPush = jest.fn();
const mockRefetch = jest.fn().mockResolvedValue(undefined);
const mockFetchNextPage = jest.fn();
const mockUseLawyerHistoryConnections = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

jest.mock('@/domain/catalog', () => ({
  useSpecialtiesCatalog: () => ({
    data: {
      items: [{ code: 'CONSUMIDOR', name: 'Direito do Consumidor', subspecialties: [] }],
    },
  }),
}));

jest.mock('@/domain/connection', () => {
  const actual = jest.requireActual('@/domain/connection');
  return {
    ...actual,
    useLawyerHistoryConnections: (...args: unknown[]) =>
      mockUseLawyerHistoryConnections(...args),
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
    status: 'ACEITA',
    uiStatus: 'accepted',
    criadoEm: '2026-08-30T12:00:00.000Z',
    decididoEm: '2026-08-30T13:00:00.000Z',
    canceladoEm: null,
    visualizadaEm: '2026-08-30T12:05:00.000Z',
    telefone: null,
    email: null,
    nomeAdvogado: null,
    nomeCliente: 'Luiza Sampaio',
    tituloSolicitacao: 'Demanda trabalhista',
    descricaoSolicitacao:
      'Preciso de orientacao sobre rescisao de contrato de aluguel com clausula de multa a...',
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

function page(
  items: ConnectionResult[],
  counts: Partial<ConnectionStatusCounts> = {},
) {
  const countsByStatus = {
    ...emptyConnectionStatusCounts(),
    ACEITA: items.filter((item) => item.status === 'ACEITA').length,
    RECUSADA: items.filter((item) => item.status === 'RECUSADA').length,
    ...counts,
  };
  return {
    items,
    totalElements: items.length,
    countsByUrgency: emptyConnectionUrgencyCounts(),
    countsByStatus,
  };
}

function mockQuery(overrides: Record<string, unknown> = {}) {
  return {
    data: { pages: [page([connection()])], pageParams: [0] },
    isLoading: false,
    isFetched: true,
    isError: false,
    refetch: mockRefetch,
    fetchNextPage: mockFetchNextPage,
    hasNextPage: false,
    isFetchingNextPage: false,
    ...overrides,
  };
}

describe('LawyerHistoricoScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockRefetch.mockClear();
    mockFetchNextPage.mockClear();
    mockUseLawyerHistoryConnections.mockImplementation(() => mockQuery());
  });

  it('requests accepted and rejected connections without search by default', () => {
    render(<LawyerHistoricoScreen />);

    expect(mockUseLawyerHistoryConnections).toHaveBeenLastCalledWith({
      status: ['ACEITA', 'RECUSADA'],
      busca: undefined,
    });
  });

  it('shows the no-data state when there is no history at all', () => {
    mockUseLawyerHistoryConnections.mockReturnValue(
      mockQuery({
        data: {
          pages: [
            {
              items: [],
              totalElements: 0,
              countsByUrgency: emptyConnectionUrgencyCounts(),
              countsByStatus: emptyConnectionStatusCounts(),
            },
          ],
          pageParams: [0],
        },
      }),
    );
    const screen = render(<LawyerHistoricoScreen />);

    expect(screen.getByText('Nenhuma solicitação encontrada')).toBeTruthy();
  });

  it('shows the specialty from the catalog on the card', () => {
    mockUseLawyerHistoryConnections.mockReturnValue(
      mockQuery({
        data: {
          pages: [page([connection({ especialidadeCodigo: 'CONSUMIDOR' })])],
          pageParams: [0],
        },
      }),
    );

    const screen = render(<LawyerHistoricoScreen />);

    expect(screen.getByText('Direito do Consumidor')).toBeTruthy();
  });

  it('shows status counts from the API on the filter chips', () => {
    mockUseLawyerHistoryConnections.mockReturnValue(
      mockQuery({
        data: {
          pages: [
            page([connection()], {
              ACEITA: 8,
              RECUSADA: 6,
              PENDENTE: 99,
            }),
          ],
          pageParams: [0],
        },
      }),
    );

    const screen = render(<LawyerHistoricoScreen />);

    expect(screen.getByText('Todas')).toBeTruthy();
    expect(screen.getByText('Aceitas')).toBeTruthy();
    expect(screen.getByText('Recusadas')).toBeTruthy();
    expect(screen.getByText('14')).toBeTruthy();
    expect(screen.getByText('8')).toBeTruthy();
    expect(screen.getByText('6')).toBeTruthy();
    expect(screen.queryByText('99')).toBeNull();
  });

  it('requests accepted connections when the Aceitas chip is pressed', () => {
    const screen = render(<LawyerHistoricoScreen />);

    fireEvent.press(screen.getByText('Aceitas'));

    expect(mockUseLawyerHistoryConnections).toHaveBeenLastCalledWith({
      status: 'ACEITA',
      busca: undefined,
    });
  });

  it('requests rejected connections when the Recusadas chip is pressed', () => {
    const screen = render(<LawyerHistoricoScreen />);

    fireEvent.press(screen.getByText('Recusadas'));

    expect(mockUseLawyerHistoryConnections).toHaveBeenLastCalledWith({
      status: 'RECUSADA',
      busca: undefined,
    });
  });

  it('sends the search term to the server and shows the results heading', async () => {
    mockUseLawyerHistoryConnections.mockImplementation(
      (params: { busca?: string } = {}) => {
        if (params.busca) {
          return mockQuery({
            data: {
              pages: [page([], { ACEITA: 1 })],
              pageParams: [0],
            },
          });
        }
        return mockQuery();
      },
    );

    const screen = render(<LawyerHistoricoScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Pesquisar' }));
    fireEvent.changeText(
      screen.getByPlaceholderText('Buscar no histórico'),
      'cliente inexistente',
    );

    await waitFor(() => {
      expect(mockUseLawyerHistoryConnections).toHaveBeenLastCalledWith({
        status: ['ACEITA', 'RECUSADA'],
        busca: 'cliente inexistente',
      });
      expect(screen.getByText('Seus resultados')).toBeTruthy();
      expect(screen.getByText('Sem resultados compatíveis')).toBeTruthy();
    });
  });

  it('loads the next page from the "Ver mais" button', () => {
    mockUseLawyerHistoryConnections.mockReturnValue(
      mockQuery({ hasNextPage: true }),
    );

    const screen = render(<LawyerHistoricoScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Ver mais' }));

    expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
  });

  it('hides "Ver mais" when the server has no further page', () => {
    const screen = render(<LawyerHistoricoScreen />);

    expect(screen.queryByRole('button', { name: 'Ver mais' })).toBeNull();
  });

  it('flattens every loaded page into the list', () => {
    mockUseLawyerHistoryConnections.mockReturnValue(
      mockQuery({
        data: {
          pages: [
            page([connection({ id: '1', nomeCliente: 'Luiza Sampaio' })]),
            page([
              connection({
                id: '2',
                nomeCliente: 'Maria Gomes',
                status: 'RECUSADA',
                uiStatus: 'rejected',
              }),
            ]),
          ],
          pageParams: [0, 10],
        },
      }),
    );

    const screen = render(<LawyerHistoricoScreen />);

    expect(screen.getByText('Luiza Sampaio')).toBeTruthy();
    expect(screen.getByText('Maria Gomes')).toBeTruthy();
  });

  it('opens solicitation details from a card', () => {
    const screen = render(<LawyerHistoricoScreen />);

    fireEvent.press(screen.getByText('Luiza Sampaio'));

    expect(mockPush).toHaveBeenCalledWith('/lawyer/solicitacao/1');
  });

  it('refetches from the list on pull-to-refresh without swapping to the loading screen', async () => {
    const screen = render(<LawyerHistoricoScreen />);

    expect(screen.getByText('Luiza Sampaio')).toBeTruthy();

    await act(async () => {
      fireEvent(screen.UNSAFE_getByType(RefreshControl), 'refresh');
    });

    expect(mockRefetch).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Luiza Sampaio')).toBeTruthy();
    expect(screen.getByText('Histórico')).toBeTruthy();
  });

  it('keeps the header and chips visible while the first page loads', () => {
    mockUseLawyerHistoryConnections.mockReturnValue(
      mockQuery({ data: undefined, isLoading: true, isFetched: false }),
    );

    const screen = render(<LawyerHistoricoScreen />);

    expect(screen.getByText('Histórico')).toBeTruthy();
    expect(screen.getByText('Todas')).toBeTruthy();
    expect(screen.queryByText('Luiza Sampaio')).toBeNull();
    expect(screen.queryByText('Nenhuma solicitação encontrada')).toBeNull();
  });
});
