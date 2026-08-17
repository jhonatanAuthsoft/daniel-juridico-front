import { fireEvent, render, waitFor } from '@testing-library/react-native';

import {
  ClientCompatibleLawyersList,
  ClientSolicitationDataAccordion,
  ClientSolicitationDescriptionAccordion,
} from './index';
import {
  MOCK_CLIENT_SOLICITATION_DETAILS,
} from './mock-client-solicitation-details';

const details =
  MOCK_CLIENT_SOLICITATION_DETAILS.find(
    (item) => item.workflowStatus === 'AGUARDANDO_MATCHING',
  ) ?? MOCK_CLIENT_SOLICITATION_DETAILS[0];

const mockMutateAsync = jest.fn().mockResolvedValue({
  id: 'cx-1',
  advogadoId: details.compatibleLawyers[0].id,
  uiStatus: 'pending',
});
const mockCancelMutateAsync = jest.fn().mockResolvedValue({
  id: 'cx-pending',
  uiStatus: 'idle',
});

jest.mock('@/domain/connection', () => ({
  useCreateConnection: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
    variables: undefined,
  }),
  useCancelConnection: () => ({
    mutateAsync: mockCancelMutateAsync,
    isPending: false,
    variables: undefined,
  }),
}));

jest.mock('@/domain/arquivo', () => ({
  useObjectReadUrl: (key: string | null | undefined) => {
    const photoKey = key?.trim();
    if (!photoKey) {
      return { data: undefined };
    }
    return { data: { readUrl: `https://cdn.example/${photoKey}` } };
  },
}));

describe('client solicitation detail components', () => {
  beforeEach(() => {
    mockMutateAsync.mockClear();
    mockCancelMutateAsync.mockClear();
  });

  it('shows solicitation data initially and allows collapsing it', () => {
    const screen = render(
      <ClientSolicitationDataAccordion solicitation={details} />,
    );

    expect(
      screen.getByRole('button', {
        name: 'Dados da solicitação',
        expanded: true,
      }),
    ).toBeTruthy();
    expect(screen.getAllByText(details.title).length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(details.specialties.join(', ')).length,
    ).toBeGreaterThan(0);

    fireEvent.press(
      screen.getByRole('button', { name: 'Dados da solicitação' }),
    );

    expect(
      screen.getByRole('button', {
        name: 'Dados da solicitação',
        expanded: false,
      }),
    ).toBeTruthy();
  });

  it('opens the solicitation description on demand', () => {
    const screen = render(
      <ClientSolicitationDescriptionAccordion
        description={details.description}
      />,
    );

    expect(
      screen.getByRole('button', {
        name: 'Descrição da solicitação',
        expanded: false,
      }),
    ).toBeTruthy();

    fireEvent.press(
      screen.getByRole('button', { name: 'Descrição da solicitação' }),
    );

    expect(
      screen.getByRole('button', {
        name: 'Descrição da solicitação',
        expanded: true,
      }),
    ).toBeTruthy();
    expect(screen.getAllByText(details.description).length).toBeGreaterThan(0);
  });

  it('lists compatible lawyers and requests a connection', async () => {
    const onLawyerPress = jest.fn();
    const lawyer = details.compatibleLawyers[0];
    const screen = render(
      <ClientCompatibleLawyersList
        connectionsByLawyerId={{}}
        lawyers={details.compatibleLawyers}
        onLawyerPress={onLawyerPress}
        solicitacaoId={details.id}
      />,
    );

    expect(screen.getByText('Advogados compatíveis')).toBeTruthy();
    expect(screen.getByText(lawyer.name)).toBeTruthy();
    expect(
      screen.getAllByText(`${lawyer.compatibility}% de compatibilidade`).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByTestId('compatible-lawyer-photo')).toHaveLength(
      details.compatibleLawyers.length,
    );

    fireEvent.press(screen.getByText(lawyer.name));

    expect(onLawyerPress).toHaveBeenCalledWith(lawyer.id);

    onLawyerPress.mockClear();
    fireEvent.press(
      screen.getAllByRole('button', { name: 'Solicitar conexão' })[0],
    );

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        solicitacaoId: details.id,
        advogadoId: lawyer.id,
      });
    });
    expect(onLawyerPress).not.toHaveBeenCalled();
  });

  it('renders connection actions for idle, pending and accepted states', () => {
    const lawyerIdle = details.compatibleLawyers[0];
    const lawyerPending = details.compatibleLawyers[1];
    const lawyerAccepted = details.compatibleLawyers[2];
    const onLawyerPress = jest.fn();

    const screen = render(
      <ClientCompatibleLawyersList
        connectionsByLawyerId={{
          [lawyerPending.id]: {
            id: 'cx-pending',
            solicitacaoId: details.id,
            clienteId: 'cli-1',
            advogadoId: lawyerPending.id,
            status: 'PENDENTE',
            uiStatus: 'pending',
            criadoEm: '2026-08-06T12:00:00',
            decididoEm: null,
            canceladoEm: null,
            telefone: null,
            email: null,
            nomeAdvogado: lawyerPending.name,
            nomeCliente: 'Cliente',
            tituloSolicitacao: null,
            descricaoSolicitacao: null,
            urgencia: null,
            modalidade: null,
            especialidadeCodigo: null,
            subespecialidadeCodigo: null,
            experienciaMinimaMeses: null,
            uf: null,
            cidade: null,
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
          },
          [lawyerAccepted.id]: {
            id: 'cx-accepted',
            solicitacaoId: details.id,
            clienteId: 'cli-1',
            advogadoId: lawyerAccepted.id,
            status: 'ACEITA',
            uiStatus: 'accepted',
            criadoEm: '2026-08-06T12:00:00',
            decididoEm: '2026-08-06T13:00:00',
            canceladoEm: null,
            telefone: '11999999999',
            email: 'adv@laweact.com',
            nomeAdvogado: lawyerAccepted.name,
            nomeCliente: 'Cliente',
            tituloSolicitacao: null,
            descricaoSolicitacao: null,
            urgencia: null,
            modalidade: null,
            especialidadeCodigo: null,
            subespecialidadeCodigo: null,
            experienciaMinimaMeses: null,
            uf: null,
            cidade: null,
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
          },
        }}
        lawyers={[lawyerIdle, lawyerPending, lawyerAccepted]}
        onLawyerPress={onLawyerPress}
        solicitacaoId={details.id}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Solicitar conexão' }),
    ).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Cancelar solicitação' }),
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Exibir contato' })).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Exibir contato' }));
    expect(onLawyerPress).toHaveBeenCalledWith(lawyerAccepted.id);
  });

  it('shows each lawyer photo from the signed read URL', () => {
    const marina = {
      ...details.compatibleLawyers[0],
      photoUrl: 'tmp/advogados/perfil/marina.jpg',
    };
    const beatriz = {
      ...details.compatibleLawyers[1],
      photoUrl: 'tmp/advogados/perfil/beatriz.jpg',
    };

    const screen = render(
      <ClientCompatibleLawyersList
        connectionsByLawyerId={{}}
        lawyers={[marina, beatriz]}
        onLawyerPress={jest.fn()}
        solicitacaoId={details.id}
      />,
    );

    const photos = screen.getAllByTestId('compatible-lawyer-photo');
    expect(photos[0]).toHaveProp('source', [
      { uri: 'https://cdn.example/tmp/advogados/perfil/marina.jpg' },
    ]);
    expect(photos[1]).toHaveProp('source', [
      { uri: 'https://cdn.example/tmp/advogados/perfil/beatriz.jpg' },
    ]);
  });
});
