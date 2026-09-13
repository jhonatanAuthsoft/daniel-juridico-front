import { useState } from 'react';
import { Button, View } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { FormProvider, useForm } from 'react-hook-form';

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

import { defaultValues } from '../constants';
import type { LawyerSignupFormValues } from '../types';

import { StepOabRegistration } from './step-oab-registration.component';

function StepHarness() {
  const [showStep, setShowStep] = useState(true);
  const form = useForm<LawyerSignupFormValues>({ defaultValues });

  return (
    <FormProvider {...form}>
      <View>
        {showStep ? <StepOabRegistration /> : null}
        <Button
          accessibilityLabel="Sair da etapa"
          onPress={() => setShowStep((current) => !current)}
          title="Sair da etapa"
        />
      </View>
    </FormProvider>
  );
}

describe('StepOabRegistration', () => {
  it('discards an unsaved empty supplemental OAB when leaving the step', () => {
    render(<StepHarness />);

    fireEvent.press(screen.getByText('+ Adicionar OAB Suplementar'));
    expect(screen.getByText('Salvar')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Sair da etapa'));
    fireEvent.press(screen.getByLabelText('Sair da etapa'));

    expect(screen.queryByText('Número da OAB E UF')).toBeNull();
    expect(screen.queryByText('Salvar')).toBeNull();
    expect(screen.getByText('+ Adicionar OAB Suplementar')).toBeTruthy();
  });
});
