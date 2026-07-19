import { render } from '@testing-library/react-native';

import { LawyerEmptyState } from './lawyer-empty-state.component';

describe('LawyerEmptyState', () => {
  it('shows the no-data copy when no solicitations exist', () => {
    const screen = render(<LawyerEmptyState variant="no-data" />);

    expect(screen.getByText('Nenhuma solicitação encontrada')).toBeTruthy();
    expect(
      screen.getByText(
        'Quando houver novas solicitações, elas aparecerão aqui para você acompanhar.',
      ),
    ).toBeTruthy();
    expect(screen.getByTestId('inbox-empty-icon')).toBeTruthy();
  });

  it('shows the no-results copy when filters have no matches', () => {
    const screen = render(<LawyerEmptyState variant="no-results" />);

    expect(screen.getByText('Sem resultados compatíveis')).toBeTruthy();
    expect(
      screen.getByText(
        'Não encontramos clientes que correspondam a sua busca.',
      ),
    ).toBeTruthy();
    expect(screen.getByTestId('search-list-icon')).toBeTruthy();
  });
});
