import { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Button } from '@/atomic/button';
import { useBanner } from '@/atomic/feedback-banner';
import { Form, useForm } from '@/atomic/form';
import { Body1 } from '@/atomic/typography';
import { AccountStackScreen } from '@/components/client-edit-data';
import { StepSpecialties } from '@/components/signup-lawyer';
import { BrandColors } from '@/constants/theme';
import { getErrorMessage } from '@/data/http';
import {
  useUpdateLawyerPracticeAreas,
  useUpdateLawyerSpecialties,
} from '@/domain/lawyer';

import {
  decodePendingPracticeAreas,
  PENDING_PRACTICE_AREAS_PARAM,
} from './lawyer-edit-practice-specialties-flow';
import { useLawyerEditProfile } from './use-lawyer-edit-profile';

type SpecialtiesForm = {
  specialties: string[];
};

export function LawyerEditSpecialtiesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    [PENDING_PRACTICE_AREAS_PARAM]?: string | string[];
  }>();
  const pendingPracticeAreas = decodePendingPracticeAreas(
    params[PENDING_PRACTICE_AREAS_PARAM],
  );
  const banner = useBanner();
  const { profile, fromMe } = useLawyerEditProfile();
  const updateSpecialties = useUpdateLawyerSpecialties();
  const updatePracticeAreas = useUpdateLawyerPracticeAreas();
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
      if (pendingPracticeAreas.length > 0) {
        await updatePracticeAreas.mutateAsync({
          practiceAreas: pendingPracticeAreas,
        });
        router.dismissTo('/lawyer/perfil/editar-dados');
        return;
      }
      router.back();
    } catch (error) {
      banner(
        getErrorMessage(error, 'Não foi possível salvar as alterações.'),
        'error',
      );
    }
  });

  const isSaving = updateSpecialties.isPending || updatePracticeAreas.isPending;
  const intro =
    pendingPracticeAreas.length > 0
      ? 'Para concluir a atuação, escolha ao menos uma especialidade.'
      : 'Escolha suas especialidades para receber demandas compatíveis.';

  return (
    <AccountStackScreen title="Alterar especialização">
      <Body1 color={BrandColors.neutral.white}>{intro}</Body1>
      <Form {...form}>
        <StepSpecialties />
      </Form>
      <Button
        disabled={isSaving}
        isLoading={isSaving}
        onPress={() => void onSubmit()}
        variant="cta">
        Salvar alterações
      </Button>
    </AccountStackScreen>
  );
}
