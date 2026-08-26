import { useEffect } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/atomic/button';
import { Form, InputSelectField, InputTextField, useForm } from '@/atomic/form';
import { Separator } from '@/atomic/separator';
import { InputCaption } from '@/atomic/typography';
import { AccountStackScreen } from '@/components/client-edit-data';
import { FieldValidators } from '@/constants/field-validators';
import { TREATMENT_PRONOUN_OPTIONS } from '@/constants/select-options';
import { BrandColors, Spacing } from '@/constants/theme';
import { getErrorMessage } from '@/data/http';
import { useUpdateLawyerBiography } from '@/domain/lawyer';

import { BIOGRAPHY_MAX_LENGTH } from './lawyer-edit-profile';
import { useLawyerEditProfile } from './use-lawyer-edit-profile';

type BioForm = {
  pronouns: string;
  biography: string;
};

export function LawyerEditBioScreen() {
  const router = useRouter();
  const { profile, fromMe } = useLawyerEditProfile();
  const updateBiography = useUpdateLawyerBiography();
  const form = useForm<BioForm>({
    defaultValues: {
      pronouns: profile.pronouns,
      biography: profile.biography,
    },
  });

  useEffect(() => {
    if (!fromMe) {
      return;
    }
    form.reset({
      pronouns: fromMe.pronouns,
      biography: fromMe.biography,
    });
  }, [form, fromMe]);

  const onSubmit = form.handleSubmit(async (formValues) => {
    try {
      await updateBiography.mutateAsync({
        pronouns: formValues.pronouns,
        biography: formValues.biography,
      });
      router.back();
    } catch (error) {
      Alert.alert(
        'Alterar biografia e pronome',
        getErrorMessage(error, 'Não foi possível salvar as alterações.'),
      );
    }
  });

  return (
    <AccountStackScreen title="Alterar biografia e pronome">
      <Form {...form}>
        <View style={styles.fields}>
          <InputSelectField
            name="pronouns"
            label="Pronome de tratamento"
            placeholder="Selecione o pronome"
            options={TREATMENT_PRONOUN_OPTIONS}
            searchable={false}
            required
          />
          <View>
            <InputTextField
              name="biography"
              label="Biografia"
              placeholder="Tenho 10 anos que atuo..."
              multiline
              maxLength={BIOGRAPHY_MAX_LENGTH}
              numberOfLines={5}
              textAlignVertical="top"
              validate={FieldValidators.required()}
            />
            <Separator size="xxxs" />
            <InputCaption color={BrandColors.neutral.light}>
              {BIOGRAPHY_MAX_LENGTH} caracteres
            </InputCaption>
          </View>
        </View>
      </Form>
      <Button
        disabled={updateBiography.isPending}
        isLoading={updateBiography.isPending}
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
