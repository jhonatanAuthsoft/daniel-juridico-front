import { fireEvent, render } from '@testing-library/react-native';
import { FormProvider, useForm } from 'react-hook-form';

import { InputSelectField } from '@/atomic/form';

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
  it('filters options through the search field', () => {
    const screen = render(<SelectHarness />);

    fireEvent.press(screen.getByText('Selecione o estado'));
    fireEvent.changeText(screen.getByLabelText('Buscar...'), 'ama');

    expect(screen.getByText('Amazonas')).toBeTruthy();
    expect(screen.queryByText('Rondônia')).toBeNull();
    expect(screen.queryByText('Acre')).toBeNull();
  });

  it('selects a filtered option', () => {
    const screen = render(<SelectHarness />);

    fireEvent.press(screen.getByText('Selecione o estado'));
    fireEvent.changeText(screen.getByLabelText('Buscar...'), 'ron');
    fireEvent.press(screen.getByText('Rondônia'));

    expect(screen.getByText('Rondônia')).toBeTruthy();
    expect(screen.queryByLabelText('Buscar...')).toBeNull();
  });

  it('hides search when searchable is false', () => {
    const screen = render(<SelectHarness searchable={false} />);

    fireEvent.press(screen.getByText('Selecione o estado'));

    expect(screen.queryByLabelText('Buscar...')).toBeNull();
    expect(screen.getByText('Acre')).toBeTruthy();
  });
});
