import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { Button } from '@/atomic/button';
import { useBanner } from '@/atomic/feedback-banner';
import { Form, InputTextField, useForm } from '@/atomic/form';
import { Link } from '@/atomic/typography';
import { FieldValidators } from '@/constants/field-validators';
import { BrandColors, Spacing } from '@/constants/theme';
import { getErrorMessage } from '@/data/http';
import { useUpdateClientGeneralData } from '@/domain/client';

import { AccountStackScreen } from './account-stack-screen.component';
import { useClientEditProfile } from './use-client-edit-profile';

type GeneralDataForm = {
  fullName: string;
  documentNumber: string;
  rg: string;
  email: string;
};

function toGeneralValues(
  fullName: string,
  documentNumber: string,
  rg: string,
  email: string,
): GeneralDataForm {
  return { fullName, documentNumber, rg, email };
}

export function ClientEditGeneralDataScreen() {
  const router = useRouter();
  const banner = useBanner();
  const { profile, fromMe } = useClientEditProfile();
  const updateGeneralData = useUpdateClientGeneralData();
  const isCnpj = profile.documentType === 'cnpj';
  const documentLabel = isCnpj ? 'CNPJ' : 'CPF';
  const values = toGeneralValues(
    profile.fullName,
    profile.documentNumber,
    profile.rg,
    profile.email,
  );

  const form = useForm<GeneralDataForm>({
    defaultValues: values,
  });

  useEffect(() => {
    if (!fromMe) {
      return;
    }
    form.reset(
      toGeneralValues(
        fromMe.fullName,
        fromMe.documentNumber,
        fromMe.rg,
        fromMe.email,
      ),
    );
  }, [form, fromMe]);

  const onSubmit = form.handleSubmit(async (formValues) => {
    try {
      await updateGeneralData.mutateAsync({ fullName: formValues.fullName });
      router.back();
    } catch (error) {
      banner(
        getErrorMessage(error, 'Não foi possível salvar as alterações.'),
        'error',
      );
    }
  });

  return (
    <AccountStackScreen title="Alterar dados gerais">
      <Form {...form}>
        <View style={styles.fields}>
          <InputTextField
            name="fullName"
            label="Nome"
            autoCapitalize="words"
            placeholder="Digite seu nome"
            validate={FieldValidators.required()}
          />
          <InputTextField
            editable={false}
            name="documentNumber"
            label={documentLabel}
          />
          {isCnpj ? null : (
            <InputTextField editable={false} name="rg" label="RG" />
          )}
          <InputTextField editable={false} name="email" label="E-mail" />
        </View>
      </Form>

      <Button
        disabled={updateGeneralData.isPending}
        isLoading={updateGeneralData.isPending}
        onPress={() => void onSubmit()}
        variant="cta">
        Salvar alterações
      </Button>

      <Pressable
        accessibilityLabel="Apagar conta"
        accessibilityRole="button"
        onPress={() => router.push('/client/perfil/apagar-conta')}
        style={({ pressed }) => [styles.deleteRow, pressed && styles.pressed]}>
        <SymbolView
          name={{ ios: 'trash', android: 'delete', web: 'delete' }}
          size={20}
          tintColor={BrandColors.feedback.error.medium}
        />
        <Link color={BrandColors.feedback.error.medium}>Apagar conta</Link>
      </Pressable>
    </AccountStackScreen>
  );
}

const styles = StyleSheet.create({
  fields: {
    gap: Spacing.sm,
    width: '100%',
  },
  deleteRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xxs,
  },
  pressed: {
    opacity: 0.75,
  },
});
