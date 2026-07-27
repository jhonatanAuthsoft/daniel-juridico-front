import { fireEvent, render } from '@testing-library/react-native';
import { FormProvider, useForm } from 'react-hook-form';

import { StepServiceRadius } from '@/components/signup-lawyer';
import { defaultValues } from '@/components/signup-lawyer/constants';

function StepHarness() {
  const form = useForm({
    defaultValues,
  });

  return (
    <FormProvider {...form}>
      <StepServiceRadius />
    </FormProvider>
  );
}

describe('StepServiceRadius', () => {
  it('shows state and city selects', () => {
    const screen = render(<StepHarness />);

    expect(screen.getByText('Estado')).toBeTruthy();
    expect(screen.getByText('Cidade')).toBeTruthy();
    expect(screen.getByText('Selecione o Estado')).toBeTruthy();
    expect(screen.getByText('Selecione a cidade')).toBeTruthy();
  });

  it('filters cities after selecting a state', () => {
    const screen = render(<StepHarness />);

    fireEvent.press(screen.getByText('Selecione o Estado'));
    fireEvent.press(screen.getByText('Bahia'));

    fireEvent.press(screen.getByText('Selecione a cidade'));

    expect(screen.getByText('Salvador')).toBeTruthy();
    expect(screen.getByText('Feira de Santana')).toBeTruthy();
  });
});
