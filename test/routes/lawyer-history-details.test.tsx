import { fireEvent, render } from '@testing-library/react-native';

import LawyerSolicitationDetailsScreen from '@/app/lawyer/solicitacao/[id]';

const mockBack = jest.fn();
let mockParams: { id: string } = { id: 'hist-2' };

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => mockParams,
  useRouter: () => ({ back: mockBack }),
}));

describe('LawyerSolicitationDetailsScreen · history', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockParams = { id: 'hist-2' };
  });

  it('shows the rejected decision state without accept actions', () => {
    const screen = render(<LawyerSolicitationDetailsScreen />);

    expect(screen.getByText('Visualizar solicitação')).toBeTruthy();
    expect(screen.getByText('Perfil do cliente')).toBeTruthy();
    expect(screen.getByText('Descrição da solicitação')).toBeTruthy();
    expect(screen.queryByText('Dados da solicitação')).toBeNull();
    expect(
      screen.queryByRole('button', { name: 'Aceitar solicitação' }),
    ).toBeNull();
    expect(screen.queryByRole('button', { name: 'Recusar' })).toBeNull();
    expect(screen.getByText('Solicitação Recusada')).toBeTruthy();
    expect(
      screen.getByText(
        /Solicitação recusada\. Suas informações de contato não serão divulgadas/,
      ),
    ).toBeTruthy();
    expect(screen.queryByText('Contatos do cliente')).toBeNull();
  });

  it('shows the accepted decision state with client contacts', () => {
    mockParams = { id: 'hist-1' };
    const screen = render(<LawyerSolicitationDetailsScreen />);

    expect(screen.getByText('Solicitação Aceita')).toBeTruthy();
    expect(screen.getByText('Contatos do cliente')).toBeTruthy();
    expect(
      screen.queryByRole('button', { name: 'Aceitar solicitação' }),
    ).toBeNull();
    expect(screen.queryByText('Dados da solicitação')).toBeNull();
  });

  it('expands the client profile on a history item', () => {
    const screen = render(<LawyerSolicitationDetailsScreen />);

    fireEvent.press(
      screen.getByRole('button', { name: 'Perfil do cliente' }),
    );

    expect(screen.getByText('Maria Gomes')).toBeTruthy();
  });
});
