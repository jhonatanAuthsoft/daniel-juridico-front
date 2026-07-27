import { useEffect } from 'react';
import { View } from 'react-native';
import { useFormContext, useWatch } from 'react-hook-form';

import { InputSelectField } from '@/atomic/form';
import { CITIES_BY_UF, STATE_OPTIONS } from '@/constants/select-options';

import { signupLawyerSharedStyles } from '../shared.styles';
import type { LawyerSignupFormValues } from '../types';

export function StepServiceRadius() {
  const { setValue } = useFormContext<LawyerSignupFormValues>();
  const serviceState = useWatch<LawyerSignupFormValues, 'serviceState'>({
    name: 'serviceState',
  });
  const cityOptions = serviceState ? (CITIES_BY_UF[serviceState] ?? []) : [];

  useEffect(() => {
    setValue('serviceCity', '');
  }, [serviceState, setValue]);

  return (
    <View style={signupLawyerSharedStyles.fields}>
      <InputSelectField
        name="serviceState"
        label="Estado"
        placeholder="Selecione o Estado"
        options={STATE_OPTIONS}
      />
      <InputSelectField
        name="serviceCity"
        label="Cidade"
        placeholder="Selecione a cidade"
        options={cityOptions}
        disabled={!serviceState}
      />
    </View>
  );
}
