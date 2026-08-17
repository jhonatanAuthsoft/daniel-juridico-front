import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { ClientSolicitationForm } from './client-solicitation-form.component';

const mockMutateAsync = jest.fn();

jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(() =>
    Promise.resolve({ isConnected: true, isInternetReachable: true }),
  ),
}));

jest.mock('@/domain/catalog', () => ({
  useSpecialtiesCatalog: () => ({
    data: {
      categories: [
        { id: 'civil', code: 'civil', label: 'Cível', children: [] },
      ],
    },
    isFetching: false,
  }),
}));

jest.mock('@/domain/address', () => ({
  useCitiesByUf: (uf: string) => ({
    data:
      uf === 'SP'
        ? [{ value: 'campinas', label: 'Campinas' }]
        : uf === 'AL'
          ? [{ value: 'maceio', label: 'Maceió' }]
          : [],
    isFetching: false,
    isError: false,
  }),
}));

jest.mock('@/domain/solicitation', () => ({
  useCreateSolicitation: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

async function fillRequiredFields(
  screen: ReturnType<typeof render>,
) {
  fireEvent.changeText(
    screen.getByPlaceholderText('Digite o título da demanda'),
    'Contrato de aluguel',
  );

  fireEvent.press(screen.getByText('Selecione a atuação'));
  fireEvent.press(screen.getByText('Consultoria jurídica'));

  fireEvent.press(screen.getByText('Selecione a especialidade'));
  fireEvent.press(screen.getByText('Cível'));

  fireEvent.press(screen.getByText('Selecione o estado'));
  fireEvent.changeText(screen.getByLabelText('Buscar...'), 'são paulo');
  fireEvent.press(screen.getByText('São Paulo'));

  fireEvent.press(screen.getByText('Selecione a cidade'));
  fireEvent.press(screen.getByText('Campinas'));

  fireEvent.press(screen.getByText('Selecione o grau de urgência'));
  fireEvent.press(screen.getByText('Tenho tempo'));

  fireEvent.changeText(
    screen.getByPlaceholderText('Descreva o problema...'),
    'Preciso revisar um contrato.',
  );
}

describe('ClientSolicitationForm', () => {
  beforeEach(() => {
    mockMutateAsync.mockReset();
    mockMutateAsync.mockResolvedValue({ totalMatches: 2 });
  });

  it('returns to the listing after a successful submit without an alert', async () => {
    const onSubmitted = jest.fn();
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const screen = render(
      <ClientSolicitationForm onClose={jest.fn()} onSubmitted={onSubmitted} />,
    );

    await fillRequiredFields(screen);
    fireEvent.press(screen.getByText('Enviar solicitação'));

    await waitFor(() => {
      expect(onSubmitted).toHaveBeenCalledTimes(1);
    });
    expect(alertSpy).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

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

  it('enables city selection after choosing Alagoas', async () => {
    const screen = render(
      <ClientSolicitationForm onClose={jest.fn()} onSubmitted={jest.fn()} />,
    );

    fireEvent.press(screen.getByText('Selecione o estado'));
    fireEvent.press(screen.getByText('Alagoas'));

    await waitFor(() => {
      expect(screen.getByText('Selecione a cidade')).toBeTruthy();
    });
    expect(screen.queryByText('Selecione o estado primeiro')).toBeNull();

    fireEvent.press(screen.getByText('Selecione a cidade'));
    fireEvent.press(screen.getByText('Maceió'));
  });
});
