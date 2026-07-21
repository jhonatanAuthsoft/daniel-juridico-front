import { fireEvent, render } from '@testing-library/react-native';

import ClientLawyerProfileScreen from '@/app/client/advogado/[id]';

const mockBack = jest.fn();
let mockLawyerId = 'lawyer-1';

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: mockLawyerId }),
  useRouter: () => ({ back: mockBack }),
}));

describe('ClientLawyerProfileScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockLawyerId = 'lawyer-1';
  });

  it('shows the lawyer profile in the client view', () => {
    const screen = render(<ClientLawyerProfileScreen />);

    expect(screen.getByText('Visualizar perfil')).toBeTruthy();
    expect(screen.getByText('Maria Gomes (Doutora/Dra.)')).toBeTruthy();
    expect(screen.getByText('Biografia')).toBeTruthy();
    expect(screen.getByText('OAB Suplementar')).toBeTruthy();
    expect(screen.getByText('Escolaridade')).toBeTruthy();
    expect(screen.getByTestId('lawyer-profile-image')).toBeTruthy();
  });

  it('changes an available connection to pending', () => {
    const screen = render(<ClientLawyerProfileScreen />);

    fireEvent.press(
      screen.getByRole('button', { name: 'Solicitar conexão' }),
    );

    expect(screen.getByText('Solicitação enviada')).toBeTruthy();
    expect(screen.getByText('Aguardando resposta...')).toBeTruthy();
  });

  it('returns to the client solicitation details', () => {
    const screen = render(<ClientLawyerProfileScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Voltar' }));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('shows the first three lawyer reviews', () => {
    const screen = render(<ClientLawyerProfileScreen />);

    expect(screen.getByText('Avaliações')).toBeTruthy();
    expect(screen.getByText('(150)')).toBeTruthy();
    expect(screen.getAllByTestId('lawyer-review-card')).toHaveLength(3);
    expect(
      screen.getByRole('button', { name: 'Veja mais avaliações' }),
    ).toBeTruthy();
  });

  it('expands and collapses the lawyer reviews', () => {
    const screen = render(<ClientLawyerProfileScreen />);

    fireEvent.press(
      screen.getByRole('button', { name: 'Veja mais avaliações' }),
    );

    expect(screen.getAllByTestId('lawyer-review-card')).toHaveLength(5);

    fireEvent.press(
      screen.getByRole('button', { name: 'Ver menos avaliações' }),
    );

    expect(screen.getAllByTestId('lawyer-review-card')).toHaveLength(3);
  });

  it('shows a pending connection and allows canceling it', () => {
    mockLawyerId = 'lawyer-2';
    const screen = render(<ClientLawyerProfileScreen />);

    expect(screen.getByText('Solicitação enviada')).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Cancelar conexão' }));
    expect(screen.getByText('Deseja cancelar a solicitação?')).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Fechar' }));
    expect(screen.queryByText('Deseja cancelar a solicitação?')).toBeNull();

    fireEvent.press(screen.getByRole('button', { name: 'Cancelar conexão' }));
    fireEvent.press(
      screen.getByRole('button', { name: 'Cancelar solicitação' }),
    );

    expect(
      screen.getByRole('button', { name: 'Solicitar conexão' }),
    ).toBeTruthy();
  });

  it('shows contact details for an accepted connection', () => {
    mockLawyerId = 'lawyer-3';
    const screen = render(<ClientLawyerProfileScreen />);

    expect(screen.getByText('Solicitação aceita')).toBeTruthy();
    expect(screen.getByText('(75) 98888-0502')).toBeTruthy();
    expect(screen.getByText('juliana.paes@gmail.com')).toBeTruthy();
  });

  it('shows when a connection was rejected', () => {
    mockLawyerId = 'lawyer-4';
    const screen = render(<ClientLawyerProfileScreen />);

    expect(screen.getByText('Solicitação recusada')).toBeTruthy();
    expect(screen.getByText('Sua solicitação foi recusada')).toBeTruthy();
  });

  it('does not allow reviewing a connection that is not accepted', () => {
    const screen = render(<ClientLawyerProfileScreen />);

    expect(
      screen.queryByRole('button', { name: 'Deixar uma avaliação' }),
    ).toBeNull();
  });

  it('validates the review rating and comment', () => {
    mockLawyerId = 'lawyer-3';
    const screen = render(<ClientLawyerProfileScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Excluir avaliação' }));
    fireEvent.press(
      screen.getByRole('button', {
        name: 'Confirmar exclusão da avaliação',
      }),
    );
    fireEvent.press(
      screen.getByRole('button', { name: 'Deixar uma avaliação' }),
    );
    fireEvent.press(screen.getByRole('button', { name: 'Avaliar' }));

    expect(screen.getByText('Selecione uma nota.')).toBeTruthy();
    expect(screen.getByText('Escreva sua avaliação.')).toBeTruthy();
  });

  it('confirms a valid review without changing the mock list', () => {
    mockLawyerId = 'lawyer-3';
    const screen = render(<ClientLawyerProfileScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Excluir avaliação' }));
    fireEvent.press(
      screen.getByRole('button', {
        name: 'Confirmar exclusão da avaliação',
      }),
    );
    fireEvent.press(
      screen.getByRole('button', { name: 'Deixar uma avaliação' }),
    );
    fireEvent.press(screen.getByRole('button', { name: 'Dar 4,5 estrelas' }));
    fireEvent.changeText(
      screen.getByPlaceholderText('Descreva sua experiência...'),
      'Excelente atendimento e comunicação.',
    );
    fireEvent.press(screen.getByRole('button', { name: 'Avaliar' }));

    expect(
      screen.queryByText('Qual nota você daria para essa conexão?'),
    ).toBeNull();
    expect(
      screen.getByRole('button', { name: 'Avaliação enviada' }),
    ).toBeDisabled();
    expect(screen.getAllByTestId('lawyer-review-card')).toHaveLength(3);
  });

  it('allows selecting half-star ratings', () => {
    mockLawyerId = 'lawyer-3';
    const screen = render(<ClientLawyerProfileScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Excluir avaliação' }));
    fireEvent.press(
      screen.getByRole('button', {
        name: 'Confirmar exclusão da avaliação',
      }),
    );
    fireEvent.press(
      screen.getByRole('button', { name: 'Deixar uma avaliação' }),
    );

    expect(
      screen.getByRole('button', { name: 'Dar 0,5 estrelas' }),
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Dar 1 estrela' })).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Dar 4,5 estrelas' }),
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Dar 5 estrelas' })).toBeTruthy();
  });

  it('shows the client review without a duplicate review action', () => {
    mockLawyerId = 'lawyer-3';
    const screen = render(<ClientLawyerProfileScreen />);

    expect(screen.getByText('Você')).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Excluir avaliação' }),
    ).toBeTruthy();
    expect(
      screen.queryByRole('button', { name: 'Deixar uma avaliação' }),
    ).toBeNull();
  });

  it('keeps the client review when deletion is dismissed', () => {
    mockLawyerId = 'lawyer-3';
    const screen = render(<ClientLawyerProfileScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Excluir avaliação' }));
    expect(screen.getByText('Excluir avaliação?')).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Fechar' }));

    expect(screen.getByText('Você')).toBeTruthy();
    expect(screen.queryByText('Excluir avaliação?')).toBeNull();
  });

  it('deletes the client review and allows reviewing again', () => {
    mockLawyerId = 'lawyer-3';
    const screen = render(<ClientLawyerProfileScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Excluir avaliação' }));
    fireEvent.press(
      screen.getByRole('button', {
        name: 'Confirmar exclusão da avaliação',
      }),
    );

    expect(screen.queryByText('Você')).toBeNull();
    expect(screen.getByText('(149)')).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Deixar uma avaliação' }),
    ).toBeTruthy();
  });
});
