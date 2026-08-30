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
import { useUpdateLawyerGraduation } from '@/domain/lawyer';

import { useLawyerEditProfile } from './use-lawyer-edit-profile';

type EducationForm = {
  university: string;
  course: string;
  graduationYear: string;
};

export function LawyerEditEducationScreen() {
  const router = useRouter();
  const banner = useBanner();
  const { profile, fromMe } = useLawyerEditProfile();
  const updateGraduation = useUpdateLawyerGraduation();
  const form = useForm<EducationForm>({
    defaultValues: {
      university: profile.university,
      course: profile.course,
      graduationYear: profile.graduationYear,
    },
  });

  useEffect(() => {
    if (!fromMe) {
      return;
    }
    form.reset({
      university: fromMe.university,
      course: fromMe.course,
      graduationYear: fromMe.graduationYear,
    });
  }, [form, fromMe]);

  const onSubmit = form.handleSubmit(async (formValues) => {
    try {
      await updateGraduation.mutateAsync({
        university: formValues.university,
        course: formValues.course,
        graduationYear: formValues.graduationYear,
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
    <AccountStackScreen title="Alterar graduação">
      <Form {...form}>
        <View style={styles.fields}>
          <InputTextField
            name="university"
            label="Universidade de Formação"
            placeholder="Digite o nome da universidade"
            autoCapitalize="words"
            validate={FieldValidators.required()}
          />
          <InputTextField
            name="course"
            label="Curso"
            placeholder="Digite o curso"
            autoCapitalize="sentences"
            validate={FieldValidators.required()}
          />
          <InputTextField
            name="graduationYear"
            label="Ano de formação"
            placeholder="Digite o ano de formação"
            keyboardType="number-pad"
            format={InputMasks.digitsMax(4)}
            maxLength={4}
            validate={FieldValidators.year}
          />
        </View>
      </Form>
      <Button
        disabled={updateGraduation.isPending}
        isLoading={updateGraduation.isPending}
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
