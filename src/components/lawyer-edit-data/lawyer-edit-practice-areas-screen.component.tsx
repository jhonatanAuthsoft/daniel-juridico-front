import { useEffect } from 'react';
import { useRouter } from 'expo-router';

import { Button } from '@/atomic/button';
import { useBanner } from '@/atomic/feedback-banner';
import { Form, useForm } from '@/atomic/form';
import { Body1 } from '@/atomic/typography';
import { AccountStackScreen } from '@/components/client-edit-data';
import { StepPracticeAreas } from '@/components/signup-lawyer';
import { BrandColors } from '@/constants/theme';
import { getErrorMessage } from '@/data/http';
import { useUpdateLawyerPracticeAreas } from '@/domain/lawyer';

import { useLawyerEditProfile } from './use-lawyer-edit-profile';

type PracticeAreasForm = {
  practiceAreas: string[];
};

export function LawyerEditPracticeAreasScreen() {
  const router = useRouter();
  const banner = useBanner();
  const { profile, fromMe } = useLawyerEditProfile();
  const updatePracticeAreas = useUpdateLawyerPracticeAreas();
  const form = useForm<PracticeAreasForm>({
    defaultValues: {
      practiceAreas: profile.practiceAreas,
    },
  });

  useEffect(() => {
    if (!fromMe) {
      return;
    }
    form.reset({
      practiceAreas: fromMe.practiceAreas,
    });
  }, [form, fromMe]);

  const onSubmit = form.handleSubmit(async (formValues) => {
    try {
      await updatePracticeAreas.mutateAsync({
        practiceAreas: formValues.practiceAreas,
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
    <AccountStackScreen title="Alterar atuação">
      <Body1 color={BrandColors.neutral.white}>
        Selecione sua área de atuação para receber solicitações alinhadas ao seu perfil
        profissional.
      </Body1>
      <Form {...form}>
        <StepPracticeAreas />
      </Form>
      <Button
        disabled={updatePracticeAreas.isPending}
        isLoading={updatePracticeAreas.isPending}
        onPress={() => void onSubmit()}
        variant="cta">
        Salvar alterações
      </Button>
    </AccountStackScreen>
  );
}
