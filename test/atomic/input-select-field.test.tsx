import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Pressable, Text } from 'react-native';
import { FormProvider, useForm } from 'react-hook-form';

import { InputSelectField } from '@/atomic/form';
import { filterSelectOptions } from '@/atomic/form/select-options-list.component';

const STATE_OPTIONS = [
  { value: 'RO', label: 'Rondônia' },
  { value: 'AC', label: 'Acre' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'RR', label: 'Roraima' },
] as const;

function SelectHarness({
  searchable = true,
}: {
  searchable?: boolean;
}) {
  const form = useForm({
    defaultValues: { state: '' },
  });

  return (
    <FormProvider {...form}>
      <InputSelectField
        name="state"
        options={STATE_OPTIONS}
        placeholder="Selecione o estado"
        searchable={searchable}
      />
    </FormProvider>
  );
}

describe('InputSelectField', () => {
  it('filters options through the search field', async () => {
    const screen = render(<SelectHarness />);

    fireEvent.press(screen.getByText('Selecione o estado'));
    fireEvent.changeText(screen.getByLabelText('Buscar...'), 'ama');

    await waitFor(() => {
      expect(screen.getByText('Amazonas')).toBeTruthy();
      expect(screen.queryByText('Rondônia')).toBeNull();
      expect(screen.queryByText('Acre')).toBeNull();
    });
  });

  it('ignores accents when filtering options', async () => {
    function AccentedHarness() {
      const form = useForm({ defaultValues: { city: '' } });
      return (
        <FormProvider {...form}>
          <InputSelectField
            name="city"
            options={[{ value: 'São Paulo', label: 'São Paulo' }]}
            placeholder="Selecione a cidade"
          />
        </FormProvider>
      );
    }

    const screen = render(<AccentedHarness />);

    fireEvent.press(screen.getByText('Selecione a cidade'));
    fireEvent.changeText(screen.getByLabelText('Buscar...'), 'sao paulo');

    await waitFor(() => {
      expect(screen.getByText('São Paulo')).toBeTruthy();
    });
  });

  it('selects a filtered option', async () => {
    const screen = render(<SelectHarness />);

    fireEvent.press(screen.getByText('Selecione o estado'));
    fireEvent.changeText(screen.getByLabelText('Buscar...'), 'ron');
    fireEvent.press(screen.getByText('Rondônia'));

    await waitFor(() => {
      expect(screen.queryByLabelText('Buscar...')).toBeNull();
    });
    expect(screen.getByText('Rondônia')).toBeTruthy();
  });

  it('clears an optional selection', async () => {
    const screen = render(<SelectHarness />);

    fireEvent.press(screen.getByText('Selecione o estado'));
    fireEvent.press(screen.getByText('Acre'));

    await waitFor(() => {
      expect(screen.getByText('Acre')).toBeTruthy();
      expect(screen.getByLabelText('Limpar seleção')).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText('Limpar seleção'));

    await waitFor(() => {
      expect(screen.getByText('Selecione o estado')).toBeTruthy();
      expect(screen.queryByLabelText('Limpar seleção')).toBeNull();
    });
  });

  it('hides search when searchable is false', () => {
    const screen = render(<SelectHarness searchable={false} />);

    fireEvent.press(screen.getByText('Selecione o estado'));

    expect(screen.queryByLabelText('Buscar...')).toBeNull();
    expect(screen.getByText('Acre')).toBeTruthy();
  });

  it('clears a required error after a value is selected', async () => {
    function RequiredHarness() {
      const form = useForm({
        defaultValues: { state: '' },
        mode: 'onBlur',
      });

      return (
        <FormProvider {...form}>
          <InputSelectField
            name="state"
            options={STATE_OPTIONS}
            placeholder="Selecione o estado"
            required
            searchable={false}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              void form.trigger('state');
            }}>
            <Text>Continuar</Text>
          </Pressable>
        </FormProvider>
      );
    }

    const screen = render(<RequiredHarness />);

    fireEvent.press(screen.getByText('Continuar'));
    await waitFor(() => {
      expect(screen.getByText('Campo obrigatório')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Selecione o estado'));
    fireEvent.press(screen.getByText('Acre'));

    await waitFor(() => {
      expect(screen.queryByText('Campo obrigatório')).toBeNull();
    });
  });

  it('shows a loading indicator beside the label', () => {
    function LoadingHarness({ labelLoading }: { labelLoading: boolean }) {
      const form = useForm({ defaultValues: { city: '' } });
      return (
        <FormProvider {...form}>
          <InputSelectField
            name="city"
            label="Cidade"
            labelLoading={labelLoading}
            options={[{ value: 'São Paulo', label: 'São Paulo' }]}
            placeholder="Selecione a cidade"
          />
        </FormProvider>
      );
    }

    const screen = render(<LoadingHarness labelLoading />);

    expect(screen.getByText('Cidade')).toBeTruthy();
    expect(screen.getByLabelText('Carregando')).toBeTruthy();

    screen.rerender(<LoadingHarness labelLoading={false} />);
    expect(screen.queryByLabelText('Carregando')).toBeNull();
  });
});

describe('filterSelectOptions', () => {
  it('keeps the original list when the query is empty', () => {
    const options = [
      { value: 'SP', label: 'São Paulo' },
      { value: 'AL', label: 'Alagoas' },
    ];

    expect(filterSelectOptions(options, '  ')).toBe(options);
  });

  it('filters without copying every keystroke cost on empty query', () => {
    const options = [{ value: 'Maceió', label: 'Maceió' }];
    expect(filterSelectOptions(options, 'mace')).toEqual(options);
  });
});
