import { useEffect } from 'react';
import { useRouter } from 'expo-router';

import { Button } from '@/atomic/button';
import { useBanner } from '@/atomic/feedback-banner';
import { Form, useForm } from '@/atomic/form';
import { AccountStackScreen } from '@/components/client-edit-data';
import { StepEducation } from '@/components/signup-lawyer/step-education';
import type { PostgraduateEntry } from '@/components/signup-lawyer/types';
import {
  UnsavedDraftProvider,
  useUnsavedDraftLeave,
} from '@/components/unsaved-draft-guard';
import { getErrorMessage } from '@/data/http';
import { useUpdateLawyerGraduation } from '@/domain/lawyer';

import { useLawyerEditProfile } from './use-lawyer-edit-profile';

type EducationForm = {
  university: string;
  course: string;
  graduationYear: string;
  postgraduates: PostgraduateEntry[];
};

export function LawyerEditEducationScreen() {
  return (
    <UnsavedDraftProvider>
      <LawyerEditEducationContent />
    </UnsavedDraftProvider>
  );
}

function LawyerEditEducationContent() {
  const router = useRouter();
  const banner = useBanner();
  const requestLeave = useUnsavedDraftLeave();
  const { profile, fromMe } = useLawyerEditProfile();
  const updateGraduation = useUpdateLawyerGraduation();
  const form = useForm<EducationForm>({
    defaultValues: {
      university: profile.university,
      course: profile.course,
      graduationYear: profile.graduationYear,
      postgraduates: profile.postgraduates,
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
      postgraduates: fromMe.postgraduates,
    });
  }, [form, fromMe]);

  const onSubmit = form.handleSubmit(async (formValues) => {
    try {
      await updateGraduation.mutateAsync({
        university: formValues.university,
        course: formValues.course,
        graduationYear: formValues.graduationYear,
        postgraduates: formValues.postgraduates,
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
    <AccountStackScreen
      onBack={() => requestLeave(() => router.back())}
      title="Formação">
      <Form {...form}>
        <StepEducation />
      </Form>
      <Button
        disabled={updateGraduation.isPending}
        isLoading={updateGraduation.isPending}
        onPress={() => {
          requestLeave(() => {
            void onSubmit();
          });
        }}
        variant="cta">
        Salvar alterações
      </Button>
    </AccountStackScreen>
  );
}
