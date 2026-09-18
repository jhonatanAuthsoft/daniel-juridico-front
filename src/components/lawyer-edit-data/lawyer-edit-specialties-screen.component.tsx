import { useEffect } from 'react';
import { useRouter } from 'expo-router';

import { Button } from '@/atomic/button';
import { useBanner } from '@/atomic/feedback-banner';
import { Form, useForm } from '@/atomic/form';
import { Body1 } from '@/atomic/typography';
import { AccountStackScreen } from '@/components/client-edit-data';
import { StepSpecialties } from '@/components/signup-lawyer';
import { BrandColors } from '@/constants/theme';
import { getErrorMessage } from '@/data/http';
import { useUpdateLawyerSpecialties } from '@/domain/lawyer';

import { useLawyerEditProfile } from './use-lawyer-edit-profile';

type SpecialtiesForm = {
  specialties: string[];
};

export function LawyerEditSpecialtiesScreen() {
  const router = useRouter();
  const banner = useBanner();
  const { profile, fromMe } = useLawyerEditProfile();
  const updateSpecialties = useUpdateLawyerSpecialties();
  const form = useForm<SpecialtiesForm>({
    defaultValues: {
      specialties: profile.specialties,
    },
  });

  useEffect(() => {
    if (!fromMe) {
      return;
    }
    form.reset({
      specialties: fromMe.specialties,
    });
  }, [form, fromMe]);

  const onSubmit = form.handleSubmit(async (formValues) => {
    try {
      await updateSpecialties.mutateAsync({
        specialties: formValues.specialties,
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
    <AccountStackScreen title="Alterar especialização">
      <Body1 color={BrandColors.neutral.white}>
        Escolha suas especialidades para receber demandas compatíveis.
      </Body1>
      <Form {...form}>
        <StepSpecialties />
      </Form>
      <Button
        disabled={updateSpecialties.isPending}
        isLoading={updateSpecialties.isPending}
        onPress={() => void onSubmit()}
        variant="cta">
        Salvar alterações
      </Button>
    </AccountStackScreen>
  );
}
