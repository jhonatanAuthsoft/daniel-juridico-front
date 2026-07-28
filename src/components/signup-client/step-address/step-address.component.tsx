import { ActivityIndicator, View } from 'react-native';

import { InputSelectField, InputTextField } from '@/atomic/form';
import { Separator } from '@/atomic/separator';
import { InputCaption } from '@/atomic/typography';
import { FieldValidators } from '@/constants/field-validators';
import { InputMasks } from '@/constants/input-masks';
import { STATE_OPTIONS } from '@/constants/select-options';
import { BrandColors } from '@/constants/theme';
import { useAddressCepAutofill } from '@/hooks/use-address-cep-autofill';

import { signupClientSharedStyles } from '../shared.styles';
import type { ClientSignupFormValues } from '../types';

export function StepAddress() {
  const {
    isFetchingCep,
    cepErrorMessage,
    cityOptions,
    isLoadingCities,
    hasState,
  } = useAddressCepAutofill<ClientSignupFormValues>();

  return (
    <View style={signupClientSharedStyles.fields}>
      <View>
        <InputTextField
          name="cep"
          label="CEP"
          placeholder="00000-000"
          keyboardType="number-pad"
          textContentType="postalCode"
          format={InputMasks.cep}
          validate={FieldValidators.cep}
          maxLength={9}
        />
        {isFetchingCep ? (
          <>
            <Separator size="xxxs" />
            <ActivityIndicator color={BrandColors.primary.light} />
          </>
        ) : null}
        {cepErrorMessage ? (
          <>
            <Separator size="xxxs" />
            <InputCaption color={BrandColors.feedback.error.light}>
              {cepErrorMessage}
            </InputCaption>
          </>
        ) : null}
      </View>
      <InputSelectField
        name="state"
        label="Estado"
        placeholder="Selecione o estado"
        options={STATE_OPTIONS}
        required
      />
      <InputSelectField
        name="city"
        label="Cidade"
        placeholder={
          isLoadingCities ? 'Carregando cidades...' : 'Selecione a cidade'
        }
        options={cityOptions}
        disabled={!hasState || isLoadingCities}
        required
      />
      <InputTextField
        name="neighborhood"
        label="Bairro"
        placeholder="Digite o bairro"
        validate={FieldValidators.required()}
      />
      <InputTextField
        name="street"
        label="Logradouro"
        placeholder="Digite o endereço"
        validate={FieldValidators.required()}
      />
      <InputTextField
        name="number"
        label="Número"
        placeholder="Ex 12"
        keyboardType="number-pad"
        format={InputMasks.digitsMax(10)}
        validate={FieldValidators.digitsMin(1, 'Número inválido')}
        maxLength={10}
      />
      <InputTextField name="complement" label="Complemento" placeholder="Ex. Casa" />
    </View>
  );
}
