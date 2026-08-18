import { fireEvent, render, waitFor } from '@testing-library/react-native';
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

  it('hides search when searchable is false', () => {
    const screen = render(<SelectHarness searchable={false} />);

    fireEvent.press(screen.getByText('Selecione o estado'));

    expect(screen.queryByLabelText('Buscar...')).toBeNull();
    expect(screen.getByText('Acre')).toBeTruthy();
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
