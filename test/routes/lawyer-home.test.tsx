import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { RefreshControl } from 'react-native';

import LawyerHomeScreen from '@/app/lawyer/(tabs)/index';
import {
  emptyConnectionUrgencyCounts,
  type ConnectionResult,
  type ConnectionUrgencyCounts,
} from '@/data/connection';

const mockPush = jest.fn();
const mockRefetch = jest.fn().mockResolvedValue(undefined);
const mockFetchNextPage = jest.fn();
const mockUseLawyerInboxConnections = jest.fn();

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
    useLawyerInboxConnections: (...args: unknown[]) =>
      mockUseLawyerInboxConnections(...args),
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
    visualizadaEm: null,
    telefone: null,
    email: null,
    nomeAdvogado: null,
    nomeCliente: 'Maria Gomes',
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
  counts: Partial<ConnectionUrgencyCounts> = {},
) {
  return {
    items,
    totalElements: items.length,
    countsByUrgency: {
      ...emptyConnectionUrgencyCounts(),
      URGENTE: items.length,
      ...counts,
    },
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

describe('LawyerHomeScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockRefetch.mockClear();
    mockFetchNextPage.mockClear();
    mockUseLawyerInboxConnections.mockImplementation(() => mockQuery());
  });

  it('requests the pending inbox without urgency filter by default', () => {
    render(<LawyerHomeScreen />);

    expect(mockUseLawyerInboxConnections).toHaveBeenLastCalledWith({
      status: 'PENDENTE',
      urgencia: undefined,
      busca: undefined,
    });
  });

  it('shows the no-data state when there is no pending connection at all', () => {
    mockUseLawyerInboxConnections.mockReturnValue(
      mockQuery({
        data: {
          pages: [
            {
              items: [],
              totalElements: 0,
              countsByUrgency: emptyConnectionUrgencyCounts(),
            },
          ],
          pageParams: [0],
        },
      }),
    );
    const screen = render(<LawyerHomeScreen />);

    expect(screen.getByText('Nenhuma solicitação encontrada')).toBeTruthy();
  });

  it('shows the specialty from the catalog on the card', () => {
    mockUseLawyerInboxConnections.mockReturnValue(
      mockQuery({
        data: {
          pages: [page([connection({ especialidadeCodigo: 'CONSUMIDOR' })])],
          pageParams: [0],
        },
      }),
    );

    const screen = render(<LawyerHomeScreen />);

    expect(screen.getByText('Direito do Consumidor')).toBeTruthy();
  });

  it('shows the solicitation description on the card, not the title', () => {
    const screen = render(<LawyerHomeScreen />);

    expect(
      screen.getByText(
        'Preciso de orientacao sobre rescisao de contrato de aluguel com clausula de multa a...',
      ),
    ).toBeTruthy();
    expect(screen.queryByText('Demanda trabalhista')).toBeNull();
  });

  it('shows urgency counts from the API on the filter chips', () => {
    mockUseLawyerInboxConnections.mockReturnValue(
      mockQuery({
        data: {
          pages: [
            page([connection()], {
              EMERGENCIA: 8,
              URGENTE: 6,
              MEDIO: 4,
              TENHO_TEMPO: 2,
            }),
          ],
          pageParams: [0],
        },
      }),
    );

    const screen = render(<LawyerHomeScreen />);

    expect(screen.getByText('Todas')).toBeTruthy();
    expect(screen.getByText('Emergência')).toBeTruthy();
    expect(screen.getByText('Urgência')).toBeTruthy();
    expect(screen.getByText('Médio')).toBeTruthy();
    expect(screen.getByText('Tenho tempo')).toBeTruthy();
    expect(screen.getByText('8')).toBeTruthy();
    expect(screen.getByText('6')).toBeTruthy();
    expect(screen.getByText('4')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
  });

  it('requests the selected urgency when a chip is pressed', () => {
    const screen = render(<LawyerHomeScreen />);

    fireEvent.press(screen.getByText('Emergência'));

    expect(mockUseLawyerInboxConnections).toHaveBeenLastCalledWith({
      status: 'PENDENTE',
      urgencia: 'EMERGENCIA',
      busca: undefined,
    });
  });

  it('sends the search term to the server and shows the results heading', async () => {
    mockUseLawyerInboxConnections.mockImplementation(
      (params: { busca?: string } = {}) => {
        if (params.busca) {
          return mockQuery({
            data: {
              pages: [page([], { URGENTE: 1 })],
              pageParams: [0],
            },
          });
        }
        return mockQuery();
      },
    );

    const screen = render(<LawyerHomeScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Pesquisar' }));
    fireEvent.changeText(
      screen.getByPlaceholderText('Buscar pedido'),
      'cliente inexistente',
    );

    await waitFor(() => {
      expect(mockUseLawyerInboxConnections).toHaveBeenLastCalledWith({
        status: 'PENDENTE',
        urgencia: undefined,
        busca: 'cliente inexistente',
      });
      expect(screen.getByText('Seus resultados')).toBeTruthy();
      expect(screen.getByText('Sem resultados compatíveis')).toBeTruthy();
    });
  });

  it('loads the next page from the "Ver mais" button', () => {
    mockUseLawyerInboxConnections.mockReturnValue(
      mockQuery({ hasNextPage: true }),
    );

    const screen = render(<LawyerHomeScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Ver mais' }));

    expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
  });

  it('hides "Ver mais" when the server has no further page', () => {
    const screen = render(<LawyerHomeScreen />);

    expect(screen.queryByRole('button', { name: 'Ver mais' })).toBeNull();
  });

  it('flattens every loaded page into the list', () => {
    mockUseLawyerInboxConnections.mockReturnValue(
      mockQuery({
        data: {
          pages: [
            page([connection({ id: '1', nomeCliente: 'Maria Gomes' })]),
            page([connection({ id: '2', nomeCliente: 'Luiza Sampaio' })]),
          ],
          pageParams: [0, 10],
        },
      }),
    );

    const screen = render(<LawyerHomeScreen />);

    expect(screen.getByText('Maria Gomes')).toBeTruthy();
    expect(screen.getByText('Luiza Sampaio')).toBeTruthy();
  });

  it('opens a client solicitation from a card', () => {
    const screen = render(<LawyerHomeScreen />);

    fireEvent.press(screen.getByText('Maria Gomes'));

    expect(mockPush).toHaveBeenCalledWith('/lawyer/solicitacao/1');
  });

  it('marks a never opened solicitation with a side accent in the urgency color', () => {
    const screen = render(<LawyerHomeScreen />);

    expect(screen.getByTestId('solicitation-card-accent')).toBeTruthy();
  });

  it('drops the accent after the lawyer has opened the solicitation', () => {
    mockUseLawyerInboxConnections.mockReturnValue(
      mockQuery({
        data: {
          pages: [
            page([connection({ visualizadaEm: '2026-09-03T12:00:00.000Z' })]),
          ],
          pageParams: [0],
        },
      }),
    );

    const screen = render(<LawyerHomeScreen />);

    expect(screen.queryByTestId('solicitation-card-accent')).toBeNull();
  });

  it('refetches from the list on pull-to-refresh without swapping to the loading screen', async () => {
    const screen = render(<LawyerHomeScreen />);

    expect(screen.getByText('Maria Gomes')).toBeTruthy();

    await act(async () => {
      fireEvent(screen.UNSAFE_getByType(RefreshControl), 'refresh');
    });

    expect(mockRefetch).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Maria Gomes')).toBeTruthy();
    expect(screen.getByText('Solicitações de Clientes')).toBeTruthy();
  });

  it('refetches from the empty state on pull-to-refresh without swapping to the loading screen', async () => {
    mockUseLawyerInboxConnections.mockReturnValue(
      mockQuery({
        data: {
          pages: [
            {
              items: [],
              totalElements: 0,
              countsByUrgency: emptyConnectionUrgencyCounts(),
            },
          ],
          pageParams: [0],
        },
      }),
    );
    const screen = render(<LawyerHomeScreen />);

    expect(screen.getByText('Nenhuma solicitação encontrada')).toBeTruthy();

    await act(async () => {
      fireEvent(screen.UNSAFE_getByType(RefreshControl), 'refresh');
    });

    expect(mockRefetch).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Nenhuma solicitação encontrada')).toBeTruthy();
    expect(screen.getByText('Solicitações de Clientes')).toBeTruthy();
  });

  it('keeps the header and chips visible while the first page loads', () => {
    mockUseLawyerInboxConnections.mockReturnValue(
      mockQuery({ data: undefined, isLoading: true, isFetched: false }),
    );

    const screen = render(<LawyerHomeScreen />);

    expect(screen.getByText('Solicitações de Clientes')).toBeTruthy();
    expect(screen.getByText('Todas')).toBeTruthy();
    expect(screen.queryByText('Maria Gomes')).toBeNull();
    expect(screen.queryByText('Nenhuma solicitação encontrada')).toBeNull();
  });
});
