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

    expect(screen.getByText(details.title)).toBeTruthy();
    expect(screen.getByText(details.specialties.join(', '))).toBeTruthy();

    fireEvent.press(
      screen.getByRole('button', { name: 'Dados da solicitação' }),
    );

    expect(screen.queryByText(details.title)).toBeNull();
  });

  it('opens the solicitation description on demand', () => {
    const screen = render(
      <ClientSolicitationDescriptionAccordion
        description={details.description}
      />,
    );

    expect(screen.queryByText(details.description)).toBeNull();

    fireEvent.press(
      screen.getByRole('button', { name: 'Descrição da solicitação' }),
    );

    expect(screen.getByText(details.description)).toBeTruthy();
  });

  it('lists compatible lawyers and requests a connection', async () => {
    const onLawyerPress = jest.fn();
    const screen = render(
      <ClientCompatibleLawyersList
        connectionsByLawyerId={{}}
        lawyers={details.compatibleLawyers}
        onLawyerPress={onLawyerPress}
        solicitacaoId={details.id}
      />,
    );

    expect(screen.getByText('Advogados compatíveis')).toBeTruthy();
    expect(screen.getByText(details.compatibleLawyers[0].name)).toBeTruthy();
    expect(
      screen.getByText(
        `${details.compatibleLawyers[0].compatibility}% de compatibilidade`,
      ),
    ).toBeTruthy();
    expect(
      screen.getAllByTestId('professional-image-placeholder'),
    ).toHaveLength(details.compatibleLawyers.length);

    fireEvent.press(screen.getByText(details.compatibleLawyers[0].name));

    expect(onLawyerPress).toHaveBeenCalledWith(
      details.compatibleLawyers[0].id,
    );

    onLawyerPress.mockClear();
    fireEvent.press(
      screen.getAllByRole('button', { name: 'Solicitar conexão' })[0],
    );

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        solicitacaoId: details.id,
        advogadoId: details.compatibleLawyers[0].id,
      });
    });
    expect(onLawyerPress).not.toHaveBeenCalled();
  });
});
