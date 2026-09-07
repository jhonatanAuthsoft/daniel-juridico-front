import { render } from '@testing-library/react-native';
import { FormProvider, useForm } from 'react-hook-form';

import { defaultValues } from '@/components/signup-client/constants';
import { StepProfessional } from '@/components/signup-client/step-professional';
import type { ClientSignupFormValues } from '@/components/signup-client/types';

function StepHarness({
  personType,
}: {
  personType: ClientSignupFormValues['personType'];
}) {
  const form = useForm({
    defaultValues: { ...defaultValues, personType },
  });

  return (
    <FormProvider {...form}>
      <StepProfessional />
    </FormProvider>
  );
}

describe('StepProfessional', () => {
  it('shows profession as required for CPF', () => {
    const screen = render(<StepHarness personType="cpf" />);

    expect(screen.getByText('Profissão')).toBeTruthy();
    expect(screen.getByText('Estado civil (opcional)')).toBeTruthy();
    expect(screen.getByText('Renda mensal (opcional)')).toBeTruthy();
  });

  it('hides profession for CNPJ and keeps optional marital status and income', () => {
    const screen = render(<StepHarness personType="cnpj" />);

    expect(screen.queryByText('Profissão')).toBeNull();
    expect(screen.getByText('Estado civil (opcional)')).toBeTruthy();
    expect(screen.getByText('Renda mensal (opcional)')).toBeTruthy();
  });
});
