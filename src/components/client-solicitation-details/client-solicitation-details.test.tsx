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

jest.mock('@/domain/connection', () => ({
  useCreateConnection: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
    variables: undefined,
  }),
}));

describe('client solicitation detail components', () => {
  beforeEach(() => {
    mockMutateAsync.mockClear();
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
    expect(
      screen.getAllByTestId('professional-image-placeholder'),
    ).toHaveLength(details.compatibleLawyers.length);

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
});
