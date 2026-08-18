import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { FormProvider, useForm } from 'react-hook-form';
import { Pressable, Text } from 'react-native';

import { defaultValues } from '@/components/signup-lawyer/constants';
import {
  StepServiceRadius,
  validateServiceAreas,
} from '@/components/signup-lawyer/step-service-radius/step-service-radius.component';

const CITIES_BY_UF: Record<string, { value: string; label: string }[]> = {
  SP: [
    { value: 'Adamantina', label: 'Adamantina' },
    { value: 'Avaré', label: 'Avaré' },
    { value: 'Campinas', label: 'Campinas' },
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
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          void form.trigger('serviceAreas');
        }}>
        <Text>Continuar</Text>
      </Pressable>
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

async function waitForDraftCities(screen: Screen, firstCity: string) {
  await waitFor(() => {
    expect(screen.getByLabelText(`Remover ${firstCity}`)).toBeTruthy();
  });
}

async function addServiceArea(
  screen: Screen,
  stateLabel: string,
  cityLabels: string[],
) {
  selectState(screen, stateLabel);
  selectCities(screen, cityLabels);
  await waitForDraftCities(screen, cityLabels[0] ?? '');
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

  it('saves a state with its cities concatenated', async () => {
    const screen = render(<StepHarness />);

    await addServiceArea(screen, 'São Paulo', ['Adamantina', 'Avaré']);

    expect(screen.getByText('São Paulo')).toBeTruthy();
    expect(screen.getByText('Adamantina; Avaré')).toBeTruthy();
    // Draft resets so the next area can be added.
    expect(screen.getByText('Selecione o estado')).toBeTruthy();
  });

  it('keeps one card per state when saving the same state twice', async () => {
    const screen = render(<StepHarness />);

    await addServiceArea(screen, 'São Paulo', ['Avaré']);
    await addServiceArea(screen, 'São Paulo', ['Adamantina']);

    expect(screen.getAllByText('São Paulo')).toHaveLength(1);
    expect(screen.getByText('Adamantina; Avaré')).toBeTruthy();
  });

  it('supports multiple states', async () => {
    const screen = render(<StepHarness />);

    await addServiceArea(screen, 'São Paulo', ['Adamantina']);
    await addServiceArea(screen, 'Bahia', ['Salvador']);

    expect(screen.getByText('Adamantina')).toBeTruthy();
    expect(screen.getByText('Salvador')).toBeTruthy();
  });

  it('edits a saved state', async () => {
    const screen = render(<StepHarness />);

    await addServiceArea(screen, 'São Paulo', ['Adamantina', 'Avaré']);
    fireEvent.press(screen.getByLabelText('Editar cidades de São Paulo'));

    expect(screen.getByText('Cancelar edição')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Remover Avaré'));
    fireEvent.press(screen.getByText('Salvar'));

    expect(screen.getByText('Adamantina')).toBeTruthy();
    expect(screen.queryByText('Avaré')).toBeNull();
    expect(screen.queryByText('Cancelar edição')).toBeNull();
  });

  it('keeps the saved state when an edit is cancelled', async () => {
    const screen = render(<StepHarness />);

    await addServiceArea(screen, 'São Paulo', ['Adamantina', 'Avaré']);
    fireEvent.press(screen.getByLabelText('Editar cidades de São Paulo'));
    fireEvent.press(screen.getByText('Cancelar edição'));

    expect(screen.getByText('Adamantina; Avaré')).toBeTruthy();
    expect(screen.getByText('Selecione o estado')).toBeTruthy();
  });

  it('deletes a saved state', async () => {
    const screen = render(<StepHarness />);

    await addServiceArea(screen, 'São Paulo', ['Adamantina', 'Avaré']);
    fireEvent.press(screen.getByLabelText('Excluir São Paulo'));

    expect(screen.queryByText('Adamantina; Avaré')).toBeNull();
    expect(screen.queryByText('São Paulo')).toBeNull();
  });

  it('limits saved cities to two names plus overflow', async () => {
    const screen = render(<StepHarness />);

    await addServiceArea(screen, 'São Paulo', ['Adamantina', 'Avaré', 'Campinas']);

    expect(
      screen.getByText('Adamantina; Avaré; e mais 1 cidade'),
    ).toBeTruthy();
    expect(screen.queryByText('Campinas')).toBeNull();
  });

  it('asks to select a city when nothing was added', async () => {
    const screen = render(<StepHarness />);

    fireEvent.press(screen.getByText('Continuar'));

    await waitFor(() => {
      expect(screen.getByText('Selecione ao menos uma cidade de atuação')).toBeTruthy();
    });
  });

  it('asks to save when cities are selected but not saved', async () => {
    const screen = render(<StepHarness />);

    selectState(screen, 'São Paulo');
    selectCities(screen, ['Adamantina', 'Avaré']);
    await waitForDraftCities(screen, 'Adamantina');
    fireEvent.press(screen.getByText('Continuar'));

    await waitFor(() => {
      expect(
        screen.getByText('Salve as cidades selecionadas para continuar'),
      ).toBeTruthy();
    });
    expect(screen.queryByText('Selecione ao menos uma cidade de atuação')).toBeNull();
  });
});

describe('validateServiceAreas', () => {
  it('passes when there is a saved service area', () => {
    expect(
      validateServiceAreas([{ state: 'SP', cities: ['Adamantina'] }], '', []),
    ).toBe(true);
  });

  it('asks to save a complete unsaved draft', () => {
    expect(validateServiceAreas([], 'SP', ['Adamantina'])).toBe(
      'Salve as cidades selecionadas para continuar',
    );
  });

  it('asks to select when the draft is incomplete', () => {
    expect(validateServiceAreas([], 'SP', [])).toBe(
      'Selecione ao menos uma cidade de atuação',
    );
    expect(validateServiceAreas([], '', [])).toBe(
      'Selecione ao menos uma cidade de atuação',
    );
  });
});
