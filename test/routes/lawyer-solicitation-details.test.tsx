import { fireEvent, render } from '@testing-library/react-native';

import LawyerSolicitationDetailsScreen from '@/app/lawyer/solicitacao/[id]';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: 'law-sol-1' }),
  useRouter: () => ({ back: mockBack }),
}));

describe('LawyerSolicitationDetailsScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
  });

  it('shows collapsed client and data sections with an open description', () => {
    const screen = render(<LawyerSolicitationDetailsScreen />);

    expect(screen.getByText('Visualizar solicitação')).toBeTruthy();
    expect(screen.getByText('Perfil do cliente')).toBeTruthy();
    expect(screen.getByText('Dados da solicitação')).toBeTruthy();
    expect(screen.getByText('Descrição da solicitação')).toBeTruthy();
    expect(
      screen.getByText(/Preciso de orientação sobre rescisão/),
    ).toBeTruthy();
    expect(screen.queryByText('Ela/Dela')).toBeNull();
  });

  it('expands the client profile', () => {
    const screen = render(<LawyerSolicitationDetailsScreen />);

    fireEvent.press(
      screen.getByRole('button', { name: 'Perfil do cliente' }),
    );

    expect(screen.getByText('Luiza Sampaio')).toBeTruthy();
    expect(screen.getByText('Ela/Dela')).toBeTruthy();
    expect(screen.getByText('Professora')).toBeTruthy();
    expect(screen.getByText('R$ 5.000,00')).toBeTruthy();
  });

  it('expands the solicitation data', () => {
    const screen = render(<LawyerSolicitationDetailsScreen />);

    fireEvent.press(
      screen.getByRole('button', { name: 'Dados da solicitação' }),
    );

    expect(screen.getByText('Direito Civil')).toBeTruthy();
    expect(screen.getByText('Honorários contratuais')).toBeTruthy();
  });

  it('accepts the solicitation and reveals client contacts', () => {
    const screen = render(<LawyerSolicitationDetailsScreen />);

    fireEvent.press(
      screen.getByRole('button', { name: 'Aceitar solicitação' }),
    );

    expect(screen.getByText('Contatos do cliente')).toBeTruthy();
    expect(screen.getByText('(75) 98888-0502')).toBeTruthy();
    expect(screen.getByText('luiza.sampaio@gmail.com')).toBeTruthy();
    expect(
      screen.queryByRole('button', { name: 'Aceitar solicitação' }),
    ).toBeNull();
  });

  it('returns to the list when the solicitation is refused', () => {
    const screen = render(<LawyerSolicitationDetailsScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Recusar' }));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
