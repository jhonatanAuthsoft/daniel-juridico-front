import { fireEvent, render } from '@testing-library/react-native';

import { ClientSolicitationForm } from './client-solicitation-form.component';

jest.mock('@/domain/catalog', () => ({
  useSpecialtiesCatalog: () => ({ data: { categories: [] }, isFetching: false }),
}));

jest.mock('@/domain/address', () => ({
  useCitiesByUf: () => ({ data: [], isFetching: false }),
}));

jest.mock('@/domain/solicitation', () => ({
  useCreateSolicitation: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
  }),
}));

describe('ClientSolicitationForm', () => {
  it('expands and collapses the advanced filters', () => {
    const screen = render(
      <ClientSolicitationForm onClose={jest.fn()} onSubmitted={jest.fn()} />,
    );

    const toggle = screen.getByRole('button', { name: 'Filtros avançados' });
    expect(toggle).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ expanded: false }),
    );
    expect(screen.getByTestId('filter-icon')).toBeTruthy();

    fireEvent.press(toggle);

    expect(toggle).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ expanded: true }),
    );
    expect(screen.getAllByText('Subespecialidade').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Formas de cobrança').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('Tempo mínimo de experiência (meses)').length,
    ).toBeGreaterThan(0);

    fireEvent.press(toggle);

    expect(toggle).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ expanded: false }),
    );
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

  it('shows the emergency attention banner only for immediate urgency', () => {
    const screen = render(
      <ClientSolicitationForm onClose={jest.fn()} onSubmitted={jest.fn()} />,
    );

    expect(screen.queryByTestId('emergency-attention-banner')).toBeNull();

    fireEvent.press(screen.getByText('Selecione o grau de urgência'));
    fireEvent.press(screen.getByText('Emergência'));

    expect(screen.getByTestId('emergency-attention-banner')).toBeTruthy();
    expect(screen.getByText('Atenção')).toBeTruthy();
    expect(
      screen.getByText(
        /Se estiver em situação de emergência policial, ligue imediatamente para o 190/,
      ),
    ).toBeTruthy();
  });
});
