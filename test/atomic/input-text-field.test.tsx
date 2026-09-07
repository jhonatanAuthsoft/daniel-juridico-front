import { render } from '@testing-library/react-native';
import { FormProvider, useForm } from 'react-hook-form';

import { InputTextField } from '@/atomic/form';

function TextHarness({ labelLoading }: { labelLoading: boolean }) {
  const form = useForm({
    defaultValues: { neighborhood: '' },
  });

  return (
    <FormProvider {...form}>
      <InputTextField
        name="neighborhood"
        label="Bairro"
        labelLoading={labelLoading}
        placeholder="Digite o bairro"
      />
    </FormProvider>
  );
}

describe('InputTextField', () => {
  it('shows a loading indicator beside the label', () => {
    const screen = render(<TextHarness labelLoading />);

    expect(screen.getByText('Bairro')).toBeTruthy();
    expect(screen.getByLabelText('Carregando')).toBeTruthy();

    screen.rerender(<TextHarness labelLoading={false} />);
    expect(screen.queryByLabelText('Carregando')).toBeNull();
  });
});
