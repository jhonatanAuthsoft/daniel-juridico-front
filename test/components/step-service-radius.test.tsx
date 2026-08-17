import { fireEvent, render } from '@testing-library/react-native';
import { FormProvider, useForm } from 'react-hook-form';

import { defaultValues } from '@/components/signup-lawyer/constants';
import { StepServiceRadius } from '@/components/signup-lawyer/step-service-radius';

const CITIES_BY_UF: Record<string, { value: string; label: string }[]> = {
  SP: [
    { value: 'Adamantina', label: 'Adamantina' },
    { value: 'Avaré', label: 'Avaré' },
  ],
  BA: [{ value: 'Salvador', label: 'Salvador' }],
};

jest.mock('@/domain/address', () => ({
  useCitiesByUf: (uf: string) => ({
    data: CITIES_BY_UF[uf] ?? [],
    isFetching: false,
  }),
}));

function StepHarness() {
  const form = useForm({ defaultValues });

  return (
    <FormProvider {...form}>
      <StepServiceRadius />
    </FormProvider>
  );
}

type Screen = ReturnType<typeof render>;

function selectState(screen: Screen, stateLabel: string) {
  fireEvent.press(screen.getByText('Selecione o estado'));
  // The option list is virtualized; searching brings the option into the window.
  fireEvent.changeText(screen.getByLabelText('Buscar...'), stateLabel);
  fireEvent.press(screen.getByRole('button', { name: stateLabel }));
}

function selectCities(screen: Screen, cityLabels: string[]) {
  fireEvent.press(screen.getByText('Selecione a cidade'));
  for (const cityLabel of cityLabels) {
    fireEvent.press(screen.getByRole('checkbox', { name: cityLabel }));
  }
  fireEvent.press(screen.getByLabelText('Fechar'));
}

function addServiceArea(
  screen: Screen,
  stateLabel: string,
  cityLabels: string[],
) {
  selectState(screen, stateLabel);
  selectCities(screen, cityLabels);
  fireEvent.press(screen.getByText('Salvar'));
}

describe('StepServiceRadius', () => {
  it('shows state and city selects', () => {
    const screen = render(<StepHarness />);

    expect(screen.getByText('Estado')).toBeTruthy();
    expect(screen.getByText('Cidade')).toBeTruthy();
    expect(screen.getByText('Selecione o estado')).toBeTruthy();
    expect(screen.getByText('Selecione o estado primeiro')).toBeTruthy();
  });

  it('lists the cities of the selected state', () => {
    const screen = render(<StepHarness />);

    selectState(screen, 'Bahia');
    fireEvent.press(screen.getByText('Selecione a cidade'));

    expect(screen.getByText('Salvador')).toBeTruthy();
    expect(screen.queryByText('Adamantina')).toBeNull();
  });

  it('saves a state with its cities concatenated', () => {
    const screen = render(<StepHarness />);

    addServiceArea(screen, 'São Paulo', ['Adamantina', 'Avaré']);

    expect(screen.getByText('São Paulo')).toBeTruthy();
    expect(screen.getByText('Adamantina; Avaré')).toBeTruthy();
    // Draft resets so the next area can be added.
    expect(screen.getByText('Selecione o estado')).toBeTruthy();
  });

  it('keeps one card per state when saving the same state twice', () => {
    const screen = render(<StepHarness />);

    addServiceArea(screen, 'São Paulo', ['Avaré']);
    addServiceArea(screen, 'São Paulo', ['Adamantina']);

    expect(screen.getAllByText('São Paulo')).toHaveLength(1);
    expect(screen.getByText('Adamantina; Avaré')).toBeTruthy();
  });

  it('supports multiple states', () => {
    const screen = render(<StepHarness />);

    addServiceArea(screen, 'São Paulo', ['Adamantina']);
    addServiceArea(screen, 'Bahia', ['Salvador']);

    expect(screen.getByText('Adamantina')).toBeTruthy();
    expect(screen.getByText('Salvador')).toBeTruthy();
  });

  it('edits a saved state', () => {
    const screen = render(<StepHarness />);

    addServiceArea(screen, 'São Paulo', ['Adamantina', 'Avaré']);
    fireEvent.press(screen.getByLabelText('Editar cidades de São Paulo'));

    expect(screen.getByText('Cancelar edição')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Remover Avaré'));
    fireEvent.press(screen.getByText('Salvar'));

    expect(screen.getByText('Adamantina')).toBeTruthy();
    expect(screen.queryByText('Adamantina; Avaré')).toBeNull();
    expect(screen.queryByText('Cancelar edição')).toBeNull();
  });

  it('keeps the saved state when an edit is cancelled', () => {
    const screen = render(<StepHarness />);

    addServiceArea(screen, 'São Paulo', ['Adamantina', 'Avaré']);
    fireEvent.press(screen.getByLabelText('Editar cidades de São Paulo'));
    fireEvent.press(screen.getByText('Cancelar edição'));

    expect(screen.getByText('Adamantina; Avaré')).toBeTruthy();
    expect(screen.getByText('Selecione o estado')).toBeTruthy();
  });

  it('deletes a saved state', () => {
    const screen = render(<StepHarness />);

    addServiceArea(screen, 'São Paulo', ['Adamantina', 'Avaré']);
    fireEvent.press(screen.getByLabelText('Excluir São Paulo'));

    expect(screen.queryByText('Adamantina; Avaré')).toBeNull();
    expect(screen.queryByText('São Paulo')).toBeNull();
  });
});
