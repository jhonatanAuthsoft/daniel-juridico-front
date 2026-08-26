import { useEffect } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/atomic/button';
import { Form, InputSelectField, InputTextField, useForm } from '@/atomic/form';
import { Separator } from '@/atomic/separator';
import { InputCaption } from '@/atomic/typography';
import { FieldValidators } from '@/constants/field-validators';
import { InputMasks } from '@/constants/input-masks';
import { STATE_OPTIONS } from '@/constants/select-options';
import { BrandColors, Spacing } from '@/constants/theme';
import { getErrorMessage } from '@/data/http';
import { useUpdateClientAddress } from '@/domain/client';
import { useAddressCepAutofill } from '@/hooks/use-address-cep-autofill';

import { AccountStackScreen } from './account-stack-screen.component';
import { useClientEditProfile } from './use-client-edit-profile';

export type AddressForm = {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
};

export function AddressFields() {
  const {
    isFetchingCep,
    cepErrorMessage,
    cityOptions,
    isLoadingCities,
    isCitiesError,
    hasCep,
    hasState,
  } = useAddressCepAutofill<AddressForm>();

  return (
    <View style={{ gap: Spacing.sm, width: '100%' }}>
      <View>
        <InputTextField
          name="cep"
          label="CEP"
          placeholder="Digite seu CEP"
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
        disabled={!hasCep}
        required
      />
      <InputSelectField
        name="city"
        label="Cidade"
        placeholder={
          !hasState
            ? 'Selecione o estado primeiro'
            : isLoadingCities
              ? 'Carregando cidades...'
              : isCitiesError
                ? 'Não foi possível carregar as cidades'
                : 'Selecione a cidade'
        }
        options={cityOptions}
        optionsLoading={isLoadingCities}
        disabled={!hasState}
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
        maxLength={10}
        validate={FieldValidators.required()}
      />
      <InputTextField name="complement" label="Complemento" placeholder="Ex. Casa" />
    </View>
  );
}

export function ClientEditAddressScreen() {
  const router = useRouter();
  const { profile, fromMe } = useClientEditProfile();
  const updateAddress = useUpdateClientAddress();
  const values: AddressForm = {
    cep: profile.cep,
    state: profile.state,
    city: profile.city,
    neighborhood: profile.neighborhood,
    street: profile.street,
    number: profile.number,
    complement: profile.complement,
  };

  const form = useForm<AddressForm>({
    defaultValues: values,
  });

  useEffect(() => {
    if (!fromMe) {
      return;
    }
    form.reset({
      cep: fromMe.cep,
      state: fromMe.state,
      city: fromMe.city,
      neighborhood: fromMe.neighborhood,
      street: fromMe.street,
      number: fromMe.number,
      complement: fromMe.complement,
    });
  }, [form, fromMe]);

  const onSubmit = form.handleSubmit(async (formValues) => {
    try {
      await updateAddress.mutateAsync(formValues);
      router.back();
    } catch (error) {
      Alert.alert(
        'Alterar endereço',
        getErrorMessage(error, 'Não foi possível salvar as alterações.'),
      );
    }
  });

  return (
    <AccountStackScreen title="Alterar endereço">
      <Form {...form}>
        <AddressFields />
      </Form>
      <Button
        disabled={updateAddress.isPending}
        isLoading={updateAddress.isPending}
        onPress={() => void onSubmit()}
        variant="cta">
        Salvar alterações
      </Button>
    </AccountStackScreen>
  );
}
