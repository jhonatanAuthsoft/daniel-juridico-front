import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/atomic/button';
import { Form, InputSelectField, InputTextField, useForm } from '@/atomic/form';
import { Body1 } from '@/atomic/typography';
import { OptionCheckbox } from '@/components/signup-lawyer';
import { FieldValidators } from '@/constants/field-validators';
import { InputMasks } from '@/constants/input-masks';
import {
  MARITAL_STATUS_OPTIONS,
  PRONOUN_OPTIONS,
} from '@/constants/select-options';
import { BrandColors, Spacing } from '@/constants/theme';
import { getErrorMessage } from '@/data/http';
import { useUpdateClientPersonalProfile } from '@/domain/client';

import { AccountStackScreen } from './account-stack-screen.component';
import { useClientEditProfile } from './use-client-edit-profile';

type PersonalProfileForm = {
  pronouns: string;
  profession: string;
  maritalStatus: string;
  monthlyIncome: string;
};

export function ClientEditPersonalProfileScreen() {
  const router = useRouter();
  const { profile, fromMe } = useClientEditProfile();
  const updatePersonalProfile = useUpdateClientPersonalProfile();
  const isCnpj = profile.documentType === 'cnpj';
  const [publicToLawyers, setPublicToLawyers] = useState(false);
  const values: PersonalProfileForm = {
    pronouns: profile.pronouns,
    profession: profile.profession,
    maritalStatus: profile.maritalStatus,
    monthlyIncome: profile.monthlyIncome,
  };

  const form = useForm<PersonalProfileForm>({
    defaultValues: values,
  });

  useEffect(() => {
    if (!fromMe) {
      return;
    }
    form.reset({
      pronouns: fromMe.pronouns,
      profession: fromMe.profession,
      maritalStatus: fromMe.maritalStatus,
      monthlyIncome: fromMe.monthlyIncome,
    });
  }, [form, fromMe]);

  const onSubmit = form.handleSubmit(async (formValues) => {
    try {
      await updatePersonalProfile.mutateAsync({
        documentType: profile.documentType,
        pronouns: formValues.pronouns,
        profession: formValues.profession,
        maritalStatus: formValues.maritalStatus,
        monthlyIncome: formValues.monthlyIncome,
      });
      router.back();
    } catch (error) {
      Alert.alert(
        'Editar perfil pessoal',
        getErrorMessage(error, 'Não foi possível salvar as alterações.'),
      );
    }
  });

  return (
    <AccountStackScreen title="Editar perfil pessoal">
      <Form {...form}>
        <View style={styles.fields}>
          <InputSelectField
            name="pronouns"
            label="Pronomes de tratamento"
            placeholder="Selecione o pronome"
            options={PRONOUN_OPTIONS}
            searchable={false}
            required
          />
          <InputTextField
            name="profession"
            label={isCnpj ? 'Área de atuação' : 'Profissão'}
            placeholder={
              isCnpj ? 'Digite a área de atuação' : 'Digite sua profissão'
            }
            autoCapitalize="sentences"
            validate={FieldValidators.required()}
          />
          <InputSelectField
            name="maritalStatus"
            label="Estado civil (opcional)"
            placeholder="Selecione o estado civil"
            options={MARITAL_STATUS_OPTIONS}
            searchable={false}
          />
          <InputTextField
            name="monthlyIncome"
            label="Renda mensal (opcional)"
            placeholder="Ex. 180,00"
            keyboardType="decimal-pad"
            format={InputMasks.currencyBr}
            iconLeft={<Body1 color={BrandColors.neutral.light}>$</Body1>}
          />
        </View>
      </Form>

      <Pressable
        accessibilityLabel="Tornar essas informações públicas para os advogados"
        accessibilityRole="checkbox"
        accessibilityState={{ checked: publicToLawyers }}
        onPress={() => setPublicToLawyers((current) => !current)}
        style={({ pressed }) => [styles.checkboxRow, pressed && styles.pressed]}>
        <OptionCheckbox checked={publicToLawyers} />
        <Body1 color={BrandColors.neutral.white} style={styles.checkboxLabel}>
          Tornar essas informações públicas para os advogados
        </Body1>
      </Pressable>

      <Button
        disabled={updatePersonalProfile.isPending}
        isLoading={updatePersonalProfile.isPending}
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
  },
  checkboxLabel: {
    flex: 1,
  },
  pressed: {
    opacity: 0.75,
  },
});
