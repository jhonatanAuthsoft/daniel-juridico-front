import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useFormContext, useWatch } from 'react-hook-form';

import { InputSelectField } from '@/atomic/form';
import { STATE_OPTIONS } from '@/constants/select-options';
import { useCitiesByUf } from '@/domain/address';

import { signupLawyerSharedStyles } from '../shared.styles';
import type { LawyerSignupFormValues } from '../types';

export function StepServiceRadius() {
  const { setValue } = useFormContext<LawyerSignupFormValues>();
  const serviceState = useWatch<LawyerSignupFormValues, 'serviceState'>({
    name: 'serviceState',
  });
  const normalizedState = (serviceState ?? '').trim().toUpperCase();
  const { data: cityOptions = [], isFetching } = useCitiesByUf(normalizedState);
  const previousStateRef = useRef(normalizedState);

  useEffect(() => {
    if (previousStateRef.current === normalizedState) {
      return;
    }
    previousStateRef.current = normalizedState;
    setValue('serviceCity', '');
  }, [normalizedState, setValue]);

  return (
    <View style={signupLawyerSharedStyles.fields}>
      <InputSelectField
        name="serviceState"
        label="Estado"
        placeholder="Selecione o Estado"
        options={STATE_OPTIONS}
        required
      />
      <InputSelectField
        name="serviceCity"
        label="Cidade"
        placeholder={
          isFetching ? 'Carregando cidades...' : 'Selecione a cidade'
        }
        options={cityOptions}
        disabled={!normalizedState || isFetching}
        required
      />
    </View>
  );
}
