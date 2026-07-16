import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useFormContext, useWatch } from 'react-hook-form';

import { InputSelectField, InputTextField } from '@/atomic/form';
import {
  CITIES_BY_UF,
  NEIGHBORHOOD_OPTIONS,
  STATE_OPTIONS,
} from '@/constants/select-options';

import { signupClientSharedStyles } from '../shared.styles';
import type { ClientSignupFormValues } from '../types';

export function StepAddress() {
  const { setValue } = useFormContext<ClientSignupFormValues>();
  const state = useWatch<ClientSignupFormValues, 'state'>({ name: 'state' });
  const previousState = useRef(state);
  const cityOptions = state ? (CITIES_BY_UF[state] ?? []) : [];

  useEffect(() => {
    if (previousState.current === state) {
      return;
    }
    previousState.current = state;
    setValue('city', '');
    setValue('neighborhood', '');
  }, [setValue, state]);

  return (
    <View style={signupClientSharedStyles.fields}>
      <InputTextField
        name="cep"
        label="CEP"
        placeholder="Digite seu CEP"
        keyboardType="number-pad"
        textContentType="postalCode"
      />
      <InputSelectField
        name="state"
        label="Estado"
        placeholder="Selecione o estado"
        options={STATE_OPTIONS}
      />
      <InputSelectField
        name="city"
        label="Cidade"
        placeholder={state ? 'Selecione a cidade' : 'Selecione o estado primeiro'}
        options={cityOptions}
        disabled={!state}
      />
      <InputSelectField
        name="neighborhood"
        label="Bairro"
        placeholder={state ? 'Selecione o bairro' : 'Selecione o estado primeiro'}
        options={NEIGHBORHOOD_OPTIONS}
        disabled={!state}
      />
      <InputTextField name="street" label="Logradouro" placeholder="Digite o endereço" />
      <InputTextField name="number" label="Número" placeholder="Ex 12" keyboardType="number-pad" />
      <InputTextField name="complement" label="Complemento" placeholder="Ex. Casa" />
    </View>
  );
}
