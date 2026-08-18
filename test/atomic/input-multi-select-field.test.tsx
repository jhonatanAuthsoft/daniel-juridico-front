import { fireEvent, render } from '@testing-library/react-native';
import { FormProvider, useForm } from 'react-hook-form';

import {
  InputMultiSelectField,
  overflowSelectionLabel,
} from '@/atomic/form/input-multi-select-field.component';

const CITY_OPTIONS = [
  { value: 'Maceió', label: 'Maceió' },
  { value: 'Arapiraca', label: 'Arapiraca' },
  { value: 'Palmeira dos Índios', label: 'Palmeira dos Índios' },
  { value: 'Rio Largo', label: 'Rio Largo' },
] as const;

function MultiSelectHarness({
  defaultCities = [] as string[],
}: {
  defaultCities?: string[];
}) {
  const form = useForm({
    defaultValues: { cities: defaultCities },
  });

  return (
    <FormProvider {...form}>
      <InputMultiSelectField
        name="cities"
        options={CITY_OPTIONS}
        placeholder="Selecione a cidade"
      />
    </FormProvider>
  );
}

describe('overflowSelectionLabel', () => {
  it('formats the remaining options count', () => {
    expect(overflowSelectionLabel(0)).toBe('');
    expect(overflowSelectionLabel(1)).toBe('e mais 1 opção');
    expect(overflowSelectionLabel(13)).toBe('e mais 13 opções');
  });
});

describe('InputMultiSelectField', () => {
  it('lists city options without a select-all row', () => {
    const screen = render(<MultiSelectHarness />);

    fireEvent.press(screen.getByText('Selecione a cidade'));

    expect(screen.queryByLabelText('Marcar todas')).toBeNull();
    expect(screen.getByText('Maceió')).toBeTruthy();
  });

  it('toggles a city immediately without closing the selector', () => {
    const screen = render(<MultiSelectHarness />);

    fireEvent.press(screen.getByText('Selecione a cidade'));
    const city = screen.getByRole('checkbox', { name: 'Maceió' });

    expect(city).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ checked: false }),
    );

    fireEvent.press(city);

    expect(city).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ checked: true }),
    );
    expect(screen.getByLabelText('Buscar...')).toBeTruthy();
  });

  it('keeps only two city badges and an overflow label', () => {
    const screen = render(
      <MultiSelectHarness
        defaultCities={['Maceió', 'Arapiraca', 'Palmeira dos Índios']}
      />,
    );

    expect(screen.getByLabelText('Remover Maceió')).toBeTruthy();
    expect(screen.getByLabelText('Remover Arapiraca')).toBeTruthy();
    expect(screen.queryByLabelText('Remover Palmeira dos Índios')).toBeNull();
    expect(screen.getByText('e mais 1 opção')).toBeTruthy();
  });
});
