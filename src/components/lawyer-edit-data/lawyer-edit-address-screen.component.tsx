import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/atomic/button';
import { Form, useForm } from '@/atomic/form';
import {
  AccountStackScreen,
  AddressFields,
  type AddressForm,
} from '@/components/client-edit-data';
import { getErrorMessage } from '@/data/http';
import { useUpdateLawyerAddress } from '@/domain/lawyer';

import { useLawyerEditProfile } from './use-lawyer-edit-profile';

export function LawyerEditAddressScreen() {
  const router = useRouter();
  const { profile, fromMe } = useLawyerEditProfile();
  const updateAddress = useUpdateLawyerAddress();
  const form = useForm<AddressForm>({
    defaultValues: {
      cep: profile.cep,
      state: profile.state,
      city: profile.city,
      neighborhood: profile.neighborhood,
      street: profile.street,
      number: profile.number,
      complement: profile.complement,
    },
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
