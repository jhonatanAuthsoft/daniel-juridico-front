import { fireEvent, render } from '@testing-library/react-native';
import { FormProvider, useForm } from 'react-hook-form';

import { StepPersonalDocuments } from '@/components/signup-client/step-personal-documents';
import { defaultValues } from '@/components/signup-client/constants';

function StepHarness() {
  const form = useForm({
    defaultValues,
  });

  return (
    <FormProvider {...form}>
      <StepPersonalDocuments />
    </FormProvider>
  );
}

describe('StepPersonalDocuments', () => {
  it('shows CPF fields by default', () => {
    const screen = render(<StepHarness />);

    expect(screen.getByText('Nome completo (nome social)')).toBeTruthy();
    expect(screen.getByText('RG')).toBeTruthy();
    expect(screen.getByText('Órgão Emissor e UF')).toBeTruthy();
    const rgInput = screen.getByPlaceholderText('00.000.000-00');
    expect(rgInput).toBeTruthy();
    expect(rgInput.props.maxLength).toBe(13);
    expect(screen.getByText('Data de Nascimento')).toBeTruthy();
    expect(screen.queryByText('Razão Social')).toBeNull();
    expect(screen.queryByPlaceholderText('00.000.000/0000-00')).toBeNull();
  });

  it('switches to CNPJ fields when CNPJ is selected', () => {
    const screen = render(<StepHarness />);

    fireEvent.press(screen.getByRole('button', { name: 'CNPJ' }));

    expect(screen.getByText('Razão Social')).toBeTruthy();
    expect(screen.getByPlaceholderText('00.000.000/0000-00')).toBeTruthy();
    expect(screen.getByText('Área de atuação')).toBeTruthy();
    expect(screen.queryByText('Nome completo (nome social)')).toBeNull();
    expect(screen.queryByText('RG')).toBeNull();
    expect(screen.queryByText('Data de Nascimento')).toBeNull();
  });

  it('returns to CPF fields when CPF is selected again', () => {
    const screen = render(<StepHarness />);

    fireEvent.press(screen.getByRole('button', { name: 'CNPJ' }));
    fireEvent.press(screen.getByRole('button', { name: 'CPF' }));

    expect(screen.getByText('Nome completo (nome social)')).toBeTruthy();
    expect(screen.getByPlaceholderText('00.000.000-00')).toBeTruthy();
    expect(screen.queryByText('Razão Social')).toBeNull();
  });
});
