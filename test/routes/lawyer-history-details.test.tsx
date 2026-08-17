import { fireEvent, render } from '@testing-library/react-native';

import LawyerSolicitationDetailsScreen from '@/app/lawyer/solicitacao/[id]';
import type { ConnectionResult } from '@/data/connection';

const mockBack = jest.fn();
const mockUseConnections = jest.fn();
let mockParams: { id: string } = { id: 'hist-2' };

const baseConnection: ConnectionResult = {
  id: 'hist-2',
  solicitacaoId: 'sol-2',
  clienteId: 'cli-2',
  advogadoId: 'adv-1',
  status: 'RECUSADA',
  uiStatus: 'rejected',
  criadoEm: '2026-08-06T12:00:00',
  decididoEm: '2026-08-06T13:00:00',
  canceladoEm: null,
  telefone: null,
  email: null,
  nomeAdvogado: 'Bruna',
  nomeCliente: 'Maria Gomes',
  tituloSolicitacao: 'Rescisão de contrato de aluguel',
  descricaoSolicitacao:
    'Preciso de orientação sobre rescisão de contrato de aluguel com cláusula de multa.',
  urgencia: 'URGENTE',
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
  useLocalSearchParams: () => mockParams,
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
      mutateAsync: jest.fn(),
      isPending: false,
    }),
    useRejectConnection: () => ({
      mutateAsync: jest.fn(),
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

describe('LawyerSolicitationDetailsScreen · history', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockParams = { id: 'hist-2' };
    stubConnections({ ...baseConnection });
  });

  it('shows the rejected decision banner without contacts', () => {
    const screen = render(<LawyerSolicitationDetailsScreen />);

    expect(screen.getByText('Visualizar solicitação')).toBeTruthy();
    expect(screen.getByText('Perfil do cliente')).toBeTruthy();
    expect(screen.getByText('Dados da solicitação')).toBeTruthy();
    expect(screen.getByText('Descrição da solicitação')).toBeTruthy();
    expect(
      screen.queryByRole('button', { name: 'Aceitar solicitação' }),
    ).toBeNull();
    expect(screen.queryByRole('button', { name: 'Recusar' })).toBeNull();
    expect(screen.getByText('Solicitação Recusada')).toBeTruthy();
    expect(screen.queryByText('Solicitação Aceita')).toBeNull();
    expect(screen.queryByText('Contatos do cliente')).toBeNull();
  });

  it('shows client contacts when accepted without the accepted decision banner', () => {
    mockParams = { id: 'hist-1' };
    stubConnections({
      ...baseConnection,
      id: 'hist-1',
      status: 'ACEITA',
      uiStatus: 'accepted',
      nomeCliente: 'Luiza Sampaio',
      clienteTelefone: '(75) 98888-0502',
      clienteEmail: 'luiza.sampaio@gmail.com',
      avaliacaoClienteNota: 4,
      avaliacaoClienteComentario:
        'Profissional excepcional, muito feliz em ser atendida por ela',
    });
    const screen = render(<LawyerSolicitationDetailsScreen />);

    expect(screen.queryByText('Solicitação Aceita')).toBeNull();
    expect(screen.queryByText('Solicitação Recusada')).toBeNull();
    expect(screen.getByText('Dados da solicitação')).toBeTruthy();
    expect(screen.getByText('Contatos do cliente')).toBeTruthy();
    expect(screen.getByText('Avaliação do cliente')).toBeTruthy();
    expect(
      screen.queryByRole('button', { name: 'Aceitar solicitação' }),
    ).toBeNull();
  });

  it('expands the client profile on a history item', () => {
    const screen = render(<LawyerSolicitationDetailsScreen />);

    fireEvent.press(
      screen.getByRole('button', { name: 'Perfil do cliente' }),
    );

    expect(screen.getAllByText('Maria Gomes').length).toBeGreaterThan(0);
  });
});
