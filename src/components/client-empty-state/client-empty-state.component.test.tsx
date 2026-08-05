import { fireEvent, render, screen } from '@testing-library/react-native';

import { ClientEmptyState } from './client-empty-state.component';

describe('ClientEmptyState', () => {
  it('renders the no-data empty state with create CTA', () => {
    const onCreatePress = jest.fn();
    render(
      <ClientEmptyState variant="no-data" onCreatePress={onCreatePress} />,
    );

    expect(screen.getByText('Nenhuma solicitação encontrada')).toBeTruthy();
    expect(
      screen.getByText(
        'Quando houver novas solicitações, elas aparecerão aqui para você acompanhar.',
      ),
    ).toBeTruthy();
    expect(screen.getByTestId('inbox-empty-icon')).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Nova solicitação' }));
    expect(onCreatePress).toHaveBeenCalledTimes(1);
  });

  it('renders the no-results empty state without CTA', () => {
    render(<ClientEmptyState variant="no-results" />);

    expect(screen.getByText('Sem resultados compatíveis')).toBeTruthy();
    expect(screen.getByTestId('search-list-icon')).toBeTruthy();
    expect(
      screen.queryByRole('button', { name: 'Nova solicitação' }),
    ).toBeNull();
  });

  it('allows overriding the no-results description', () => {
    render(
      <ClientEmptyState
        variant="no-results"
        description="Não encontramos solicitações que correspondam à sua busca."
      />,
    );

    expect(
      screen.getByText(
        'Não encontramos solicitações que correspondam à sua busca.',
      ),
    ).toBeTruthy();
  });
});
