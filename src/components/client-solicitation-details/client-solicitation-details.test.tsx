import { fireEvent, render } from '@testing-library/react-native';

import {
  ClientCompatibleLawyersList,
  ClientSolicitationDataAccordion,
  ClientSolicitationDescriptionAccordion,
} from './index';
import {
  MOCK_CLIENT_SOLICITATION_DETAILS,
} from './mock-client-solicitation-details';

const details = MOCK_CLIENT_SOLICITATION_DETAILS[0];

describe('client solicitation detail components', () => {
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

  it('lists compatible lawyers and updates a requested connection', () => {
    const onLawyerPress = jest.fn();
    const screen = render(
      <ClientCompatibleLawyersList
        lawyers={details.compatibleLawyers}
        onLawyerPress={onLawyerPress}
      />,
    );

    expect(screen.getByText('Advogados compatíveis')).toBeTruthy();
    expect(screen.getByText(details.compatibleLawyers[0].name)).toBeTruthy();
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

    expect(screen.getByText('Conexão solicitada')).toBeTruthy();
    expect(onLawyerPress).not.toHaveBeenCalled();
  });
});
