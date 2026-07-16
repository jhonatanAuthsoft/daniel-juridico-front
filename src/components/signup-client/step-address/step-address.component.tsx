import { ActivityIndicator, View } from 'react-native';

import { InputSelectField, InputTextField } from '@/atomic/form';
import { Separator } from '@/atomic/separator';
import { InputCaption } from '@/atomic/typography';
import { STATE_OPTIONS } from '@/constants/select-options';
import { BrandColors } from '@/constants/theme';
import { useAddressCepAutofill } from '@/hooks/use-address-cep-autofill';

import { signupClientSharedStyles } from '../shared.styles';
import type { ClientSignupFormValues } from '../types';

export function StepAddress() {
  const { isFetchingCep, cepErrorMessage, cityOptions, neighborhoodOptions } =
    useAddressCepAutofill<ClientSignupFormValues>();

  return (
    <View style={signupClientSharedStyles.fields}>
      <View>
        <InputTextField
          name="cep"
          label="CEP"
          placeholder="Digite seu CEP"
          keyboardType="number-pad"
          textContentType="postalCode"
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
      />
      <InputSelectField
        name="city"
        label="Cidade"
        placeholder="Selecione a cidade"
        options={cityOptions}
      />
      <InputSelectField
        name="neighborhood"
        label="Bairro"
        placeholder="Selecione o bairro"
        options={neighborhoodOptions}
      />
      <InputTextField name="street" label="Logradouro" placeholder="Digite o endereço" />
      <InputTextField name="number" label="Número" placeholder="Ex 12" keyboardType="number-pad" />
      <InputTextField name="complement" label="Complemento" placeholder="Ex. Casa" />
    </View>
  );
}
