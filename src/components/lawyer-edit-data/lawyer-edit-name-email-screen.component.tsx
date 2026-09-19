import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/atomic/button';
import { useBanner } from '@/atomic/feedback-banner';
import { Form, InputTextField, useForm } from '@/atomic/form';
import { AccountStackScreen } from '@/components/client-edit-data';
import { FieldValidators } from '@/constants/field-validators';
import { InputMasks } from '@/constants/input-masks';
import { Spacing } from '@/constants/theme';
import { getErrorMessage } from '@/data/http';
import { useUpdateLawyerGeneralData } from '@/domain/lawyer';

import { useLawyerEditProfile } from './use-lawyer-edit-profile';

type NameEmailForm = {
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
};

export function LawyerEditNameEmailScreen() {
  const router = useRouter();
  const banner = useBanner();
  const { profile, fromMe } = useLawyerEditProfile();
  const updateGeneralData = useUpdateLawyerGeneralData();
  const form = useForm<NameEmailForm>({
    defaultValues: {
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      birthDate: profile.birthDate,
    },
  });

  useEffect(() => {
    if (!fromMe) {
      return;
    }
    form.reset({
      fullName: fromMe.fullName,
      email: fromMe.email,
      phone: fromMe.phone,
      birthDate: fromMe.birthDate,
    });
  }, [form, fromMe]);

  const onSubmit = form.handleSubmit(async (formValues) => {
    try {
      await updateGeneralData.mutateAsync({
        fullName: formValues.fullName,
        phone: formValues.phone,
        birthDate: formValues.birthDate,
      });
      router.back();
    } catch (error) {
      banner(
        getErrorMessage(error, 'Não foi possível salvar as alterações.'),
        'error',
      );
    }
  });

  return (
    <AccountStackScreen title="Alterar dados pessoais">
      <Form {...form}>
        <View style={styles.fields}>
          <InputTextField
            name="fullName"
            label="Nome Completo (Nome Social)"
            autoCapitalize="words"
            placeholder="Digite seu nome"
            validate={FieldValidators.required()}
          />
          <InputTextField editable={false} name="email" label="E-mail" />
          <InputTextField
            name="phone"
            label="Telefone"
            placeholder="(11) 2222-1214"
            keyboardType="phone-pad"
            autoComplete="tel"
            textContentType="telephoneNumber"
            format={InputMasks.phone}
            validate={FieldValidators.phone}
          />
          <InputTextField
            name="birthDate"
            label="Data de Nascimento"
            placeholder="00/00/0000"
            keyboardType="number-pad"
            format={InputMasks.dateBr}
            validate={FieldValidators.dateBrBirth}
            maxLength={10}
          />
        </View>
      </Form>
      <Button
        disabled={updateGeneralData.isPending}
        isLoading={updateGeneralData.isPending}
        onPress={() => void onSubmit()}
        variant="cta">
        Salvar alterações
      </Button>
    </AccountStackScreen>
  );
}

const styles = StyleSheet.create({
  fields: {
    gap: Spacing.sm,
    width: '100%',
  },
});
