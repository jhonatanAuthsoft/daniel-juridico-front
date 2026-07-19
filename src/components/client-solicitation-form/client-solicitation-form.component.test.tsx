import { fireEvent, render } from '@testing-library/react-native';

import { ClientSolicitationForm } from './client-solicitation-form.component';

describe('ClientSolicitationForm', () => {
  it('expands and collapses the advanced filters', () => {
    const screen = render(
      <ClientSolicitationForm onClose={jest.fn()} onSubmitted={jest.fn()} />,
    );

    expect(screen.queryByText('Subespecialidade')).toBeNull();
    expect(screen.getByTestId('filter-icon')).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Filtros avançados' }));

    expect(screen.getByText('Subespecialidade')).toBeTruthy();
    expect(screen.getByText('Formas de cobrança')).toBeTruthy();
    expect(screen.getByText('Tempo mínimo de experiência (meses)')).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Filtros avançados' }));

    expect(screen.queryByText('Subespecialidade')).toBeNull();
  });

  it('limits the problem description to 800 characters', () => {
    const screen = render(
      <ClientSolicitationForm onClose={jest.fn()} onSubmitted={jest.fn()} />,
    );
    const problem = screen.getByPlaceholderText('Descreva o problema...');

    fireEvent.changeText(problem, 'a'.repeat(800));

    expect(problem.props.maxLength).toBe(800);
    expect(problem.props.value).toHaveLength(800);
    expect(screen.getByText('0 caracteres restantes')).toBeTruthy();
  });
});
