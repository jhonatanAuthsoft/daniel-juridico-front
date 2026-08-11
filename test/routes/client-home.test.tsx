import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import ClientHomeScreen from '@/app/client/(tabs)/index';
import type { ClientSolicitationCardData } from '@/components/client-solicitation-card';
import { emptySolicitationStatusCounts } from '@/data/solicitation';

const mockPush = jest.fn();

const MOCK_ITEMS: ClientSolicitationCardData[] = [
  {
    id: 'sol-1',
    status: 'urgente',
    workflowStatus: 'AGUARDANDO_MATCHING',
    title: 'Pensão Alimentícia',
    description: 'Preciso de orientação sobre pensão alimentícia.',
    date: '01/08/2026',
    lawyerCount: 3,
    footerVariant: 'compatible',
  },
  {
    id: 'sol-2',
    status: 'medio',
    workflowStatus: 'AGUARDANDO_MATCHING',
    title: 'Contrato de Aluguel',
    description: 'Revisão de contrato de locação.',
    date: '02/08/2026',
    lawyerCount: 1,
    footerVariant: 'compatible',
  },
];

const MOCK_COUNTS = {
  ...emptySolicitationStatusCounts(),
  AGUARDANDO_MATCHING: 2,
};

function mockListQuery(overrides: Record<string, unknown> = {}) {
  return {
    data: {
      pages: [
        {
          items: MOCK_ITEMS,
          totalElements: MOCK_ITEMS.length,
          countsByStatus: MOCK_COUNTS,
        },
      ],
      pageParams: [0],
    },
    isLoading: false,
    isFetched: true,
    isError: false,
    error: null,
    refetch: jest.fn(),
    isRefetching: false,
    fetchNextPage: jest.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    ...overrides,
  };
}

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

const mockUseClientSolicitations = jest.fn();

jest.mock('@/domain/solicitation', () => ({
  useClientSolicitations: (...args: unknown[]) =>
    mockUseClientSolicitations(...args),
}));

describe('ClientHomeScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockUseClientSolicitations.mockImplementation(() => mockListQuery());
  });

  it('opens the new solicitation form from the CTA', () => {
    render(<ClientHomeScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Nova solicitação' }));

    expect(mockPush).toHaveBeenCalledWith('/client/nova-solicitacao');
  });

  it('opens the client solicitation details from a card', () => {
    render(<ClientHomeScreen />);

    fireEvent.press(screen.getAllByText('Pensão Alimentícia')[0]);

    expect(mockPush).toHaveBeenCalledWith('/client/solicitacao/sol-1');
  });

  it('shows the empty state and replaces the floating CTA when there are no results', () => {
    mockUseClientSolicitations.mockReturnValue(
      mockListQuery({
        data: {
          pages: [
            {
              items: [],
              totalElements: 0,
              countsByStatus: emptySolicitationStatusCounts(),
            },
          ],
          pageParams: [0],
        },
      }),
    );

    render(<ClientHomeScreen />);

    expect(screen.getByText('Nenhuma solicitação encontrada')).toBeTruthy();
    expect(
      screen.getByText(
        'Quando houver novas solicitações, elas aparecerão aqui para você acompanhar.',
      ),
    ).toBeTruthy();
    expect(screen.getByTestId('inbox-empty-icon')).toBeTruthy();
    expect(
      screen.getAllByRole('button', { name: 'Nova solicitação' }),
    ).toHaveLength(1);
  });

  it('shows the no-results state and heading for an empty search', async () => {
    mockUseClientSolicitations.mockImplementation(
      (params: { busca?: string } = {}) => {
        if (params.busca) {
          return mockListQuery({
            data: {
              pages: [
                {
                  items: [],
                  totalElements: 0,
                  countsByStatus: MOCK_COUNTS,
                },
              ],
              pageParams: [0],
            },
          });
        }
        return mockListQuery();
      },
    );

    render(<ClientHomeScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Pesquisar' }));
    fireEvent.changeText(
      screen.getByPlaceholderText('Buscar solicitação'),
      'solicitação inexistente',
    );

    await waitFor(() => {
      expect(screen.getByText('Seus resultados')).toBeTruthy();
      expect(screen.getByText('Sem resultados compatíveis')).toBeTruthy();
      expect(screen.getByTestId('search-list-icon')).toBeTruthy();
    });
  });

  it('requests canceled status when the canceled filter is selected', () => {
    render(<ClientHomeScreen />);

    fireEvent.press(screen.getByText('Canceladas'));

    expect(mockUseClientSolicitations).toHaveBeenLastCalledWith({
      status: 'CANCELADA',
      busca: undefined,
    });
  });

  it('shows status counts from the API on filter chips', () => {
    mockUseClientSolicitations.mockReturnValue(
      mockListQuery({
        data: {
          pages: [
            {
              items: MOCK_ITEMS,
              totalElements: MOCK_ITEMS.length,
              countsByStatus: {
                ...emptySolicitationStatusCounts(),
                AGUARDANDO_MATCHING: 7,
                MATCH_REALIZADO: 8,
                CANCELADA: 9,
              },
            },
          ],
          pageParams: [0],
        },
      }),
    );

    render(<ClientHomeScreen />);

    expect(screen.getByText('Pendentes')).toBeTruthy();
    expect(screen.getByText('Aceitas')).toBeTruthy();
    expect(screen.getByText('Canceladas')).toBeTruthy();
    expect(screen.getByText('7')).toBeTruthy();
    expect(screen.getByText('8')).toBeTruthy();
    expect(screen.getByText('9')).toBeTruthy();
  });

  it('keeps the header visible and shows card shimmers while loading', () => {
    mockUseClientSolicitations.mockReturnValue(
      mockListQuery({
        data: undefined,
        isLoading: true,
        isFetched: false,
      }),
    );

    render(<ClientHomeScreen />);

    expect(screen.getByText('Solicitações')).toBeTruthy();
    expect(screen.getByText('Todas')).toBeTruthy();
    expect(screen.getAllByLabelText('Carregando solicitação')).toHaveLength(4);
    expect(screen.queryByText('Pensão Alimentícia')).toBeNull();
  });
});
