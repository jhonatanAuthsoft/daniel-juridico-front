import { fireEvent, render, waitFor } from '@testing-library/react-native';

import LawyerSolicitationDetailsScreen from '@/app/lawyer/solicitacao/[id]';
import type { ConnectionResult } from '@/data/connection';

const mockBack = jest.fn();
const mockAccept = jest.fn();
const mockReject = jest.fn();
const mockUseConnections = jest.fn();

const pendingConnection: ConnectionResult = {
  id: 'law-sol-1',
  solicitacaoId: 'sol-1',
  clienteId: 'cli-1',
  advogadoId: 'adv-1',
  status: 'PENDENTE',
  uiStatus: 'pending',
  criadoEm: '2026-08-06T12:00:00',
  decididoEm: null,
  canceladoEm: null,
  telefone: null,
  email: null,
  nomeAdvogado: 'Bruna',
  nomeCliente: 'Luiza Sampaio',
  tituloSolicitacao: 'Rescisão de contrato de aluguel',
  descricaoSolicitacao:
    'Preciso de orientação sobre rescisão de contrato de aluguel com cláusula de multa.',
  urgencia: 'EMERGENCIA',
  modalidade: 'CONSULTORIA',
  especialidadeCodigo: 'CIVIL',
  subespecialidadeCodigo: 'CONTRATOS',
  experienciaMinimaMeses: 6,
  uf: 'BA',
  cidade: 'Salvador',
  formaCobranca: 'VALOR_FIXO',
  clienteProfissao: 'Professora',
  clientePronomes: 'ELA',
  clienteEstadoCivil: 'Solteiro(a)',
  clienteFaixaRenda: 'R$ 5.000,00',
  clienteFotoUrl: null,
  clienteCidade: 'Salvador',
  clienteUf: 'BA',
  clienteTelefone: null,
  clienteEmail: null,
  avaliacaoClienteNota: null,
  avaliacaoClienteComentario: null,
};

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: 'law-sol-1' }),
  useRouter: () => ({ back: mockBack }),
}));

jest.mock('react-native-safe-area-context', () => {
  const actual = jest.requireActual('react-native-safe-area-context');
  return {
    ...actual,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

jest.mock('@/domain/arquivo', () => ({
  useObjectReadUrl: () => ({ data: null }),
}));

jest.mock('@/domain/catalog', () => ({
  useSpecialtiesCatalog: () => ({
    data: {
      items: [
        {
          code: 'CIVIL',
          name: 'Direito Civil',
          subspecialties: [{ code: 'CONTRATOS', name: 'Contratos' }],
        },
      ],
    },
    isLoading: false,
  }),
}));

jest.mock('@/domain/connection', () => {
  const actual = jest.requireActual('@/domain/connection');
  return {
    ...actual,
    useConnections: (...args: unknown[]) => mockUseConnections(...args),
    useAcceptConnection: () => ({
      mutateAsync: mockAccept,
      isPending: false,
    }),
    useRejectConnection: () => ({
      mutateAsync: mockReject,
      isPending: false,
    }),
  };
});

function stubConnections(connection: ConnectionResult) {
  mockUseConnections.mockReturnValue({
    data: [connection],
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
  });
}

describe('LawyerSolicitationDetailsScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockAccept.mockReset();
    mockReject.mockReset();
    stubConnections({ ...pendingConnection });
    mockAccept.mockResolvedValue(undefined);
    mockReject.mockResolvedValue(undefined);
  });

  it('shows collapsed client profile with open solicitation data and description', () => {
    const screen = render(<LawyerSolicitationDetailsScreen />);

    expect(screen.getByText('Visualizar solicitação')).toBeTruthy();
    expect(screen.getByText('Perfil do cliente')).toBeTruthy();
    expect(screen.getByText('Dados da solicitação')).toBeTruthy();
    expect(screen.getAllByText('Grau de Urgência').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Tempo de experiência').length).toBeGreaterThan(0);
    expect(screen.getAllByText('6 meses').length).toBeGreaterThan(0);
    expect(screen.getByText('Descrição da solicitação')).toBeTruthy();
    expect(
      screen.getAllByText(/Preciso de orientação sobre rescisão/).length,
    ).toBeGreaterThan(0);
    expect(screen.getByText('Atenção')).toBeTruthy();
  });

  it('hides the emergency banner when urgency is not emergency', () => {
    stubConnections({ ...pendingConnection, urgencia: 'MEDIO' });
    const screen = render(<LawyerSolicitationDetailsScreen />);

    expect(screen.queryByText('Atenção')).toBeNull();
  });

  it('expands the client profile', () => {
    const screen = render(<LawyerSolicitationDetailsScreen />);

    fireEvent.press(
      screen.getByRole('button', { name: 'Perfil do cliente' }),
    );

    expect(screen.getAllByText('Luiza Sampaio').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Ela/Dela').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Professora').length).toBeGreaterThan(0);
    expect(screen.getAllByText('R$ 5.000,00').length).toBeGreaterThan(0);
  });

  it('expands the solicitation data', () => {
    const screen = render(<LawyerSolicitationDetailsScreen />);

    expect(screen.getAllByText('Direito Civil').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Contratos').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Valor fixo').length).toBeGreaterThan(0);
  });

  it('places client contacts below solicitation data when accepted', async () => {
    const screen = render(<LawyerSolicitationDetailsScreen />);

    fireEvent.press(
      screen.getByRole('button', { name: 'Aceitar solicitação' }),
    );

    await waitFor(() => {
      expect(mockAccept).toHaveBeenCalledWith('law-sol-1');
    });

    stubConnections({
      ...pendingConnection,
      status: 'ACEITA',
      uiStatus: 'accepted',
      clienteTelefone: '(75) 98888-0502',
      clienteEmail: 'luiza.sampaio@gmail.com',
    });
    screen.rerender(<LawyerSolicitationDetailsScreen />);

    expect(screen.getByText('Contatos do cliente')).toBeTruthy();
    expect(screen.getByText('(75) 98888-0502')).toBeTruthy();
    expect(screen.getByText('luiza.sampaio@gmail.com')).toBeTruthy();
    expect(
      screen.queryByRole('button', { name: 'Aceitar solicitação' }),
    ).toBeNull();
  });

  it('shows the client review as the last block when present', () => {
    stubConnections({
      ...pendingConnection,
      status: 'ACEITA',
      uiStatus: 'accepted',
      clienteTelefone: '(75) 98888-0502',
      clienteEmail: 'luiza.sampaio@gmail.com',
      avaliacaoClienteNota: 4,
      avaliacaoClienteComentario:
        'Profissional excepcional, muito feliz em ser atendida por ela',
    });
    const screen = render(<LawyerSolicitationDetailsScreen />);

    expect(screen.getByText('Avaliação do cliente')).toBeTruthy();
    expect(screen.getByText('4 estrelas')).toBeTruthy();
    expect(
      screen.getByText(
        'Profissional excepcional, muito feliz em ser atendida por ela',
      ),
    ).toBeTruthy();
    expect(screen.queryByText('Avaliação do cliente')).toBeTruthy();
  });

  it('hides the client review when the connection has none', () => {
    stubConnections({
      ...pendingConnection,
      status: 'ACEITA',
      uiStatus: 'accepted',
      clienteTelefone: '(75) 98888-0502',
      clienteEmail: 'luiza.sampaio@gmail.com',
    });
    const screen = render(<LawyerSolicitationDetailsScreen />);

    expect(screen.queryByText('Avaliação do cliente')).toBeNull();
  });

  it('returns to the list when the solicitation is refused', async () => {
    const screen = render(<LawyerSolicitationDetailsScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Recusar' }));

    await waitFor(() => {
      expect(mockReject).toHaveBeenCalledWith('law-sol-1');
      expect(mockBack).toHaveBeenCalledTimes(1);
    });
  });
});
