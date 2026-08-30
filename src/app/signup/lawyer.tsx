import { useRouter } from 'expo-router';
import { useState } from 'react';

import { BackLink } from '@/atomic/back-link';
import { Button } from '@/atomic/button';
import { useBanner } from '@/atomic/feedback-banner';
import { Form, useForm } from '@/atomic/form';
import { Separator } from '@/atomic/separator';
import {
  defaultValues,
  getNextLawyerSignupStep,
  getPreviousLawyerSignupStep,
  shouldShowSpecialtiesStep,
  STEP_COPY,
  StepAboutYou,
  StepAddress,
  StepBasicData,
  StepBilling,
  StepDocumentation,
  StepEducation,
  StepOabRegistration,
  StepPracticeAreas,
  StepServiceRadius,
  StepSpecialties,
  TOTAL_STEPS,
  type LawyerSignupFormValues,
} from '@/components/signup-lawyer';
import { getLawyerSignupStepFields } from '@/components/signup-lawyer/step-fields';
import { SignupMultiStepShell } from '@/components/signup-shell';
import { useRegisterLawyer } from '@/domain/lawyer';

export default function LawyerSignupScreen() {
  const router = useRouter();
  const banner = useBanner();
  const [step, setStep] = useState(1);
  const [showPasswordErrors, setShowPasswordErrors] = useState(false);
  const form = useForm<LawyerSignupFormValues>({
    defaultValues,
    mode: 'onBlur',
  });
  const registerLawyer = useRegisterLawyer();

  const stepCopy = STEP_COPY[step];
  const isSubmitting = registerLawyer.isPending;

  const goBack = () => {
    if (isSubmitting) {
      return;
    }
    if (step === 1) {
      router.back();
      return;
    }
    const practiceAreas = form.getValues('practiceAreas');
    setStep(getPreviousLawyerSignupStep(step, practiceAreas));
  };

  const submitRegistration = form.handleSubmit(async (values) => {
    try {
      await registerLawyer.mutateAsync(values);
      router.push('/signup/terms?profile=lawyer');
    } catch (error) {
      banner(
        error instanceof Error ? error.message : 'Não foi possível concluir o cadastro.',
        'error',
      );
    }
  });

  const goNext = async () => {
    const values = form.getValues();
    if (step === 1) {
      setShowPasswordErrors(true);
    }

    const fields = getLawyerSignupStepFields(step, values);
    const valid = await form.trigger(fields);
    if (!valid) {
      return;
    }

    const practiceAreas = values.practiceAreas;
    const nextStep = getNextLawyerSignupStep(
      step,
      practiceAreas,
      TOTAL_STEPS,
    );

    if (nextStep === 'done') {
      void submitRegistration();
      return;
    }

    if (
      step === 6 &&
      nextStep === 8 &&
      !shouldShowSpecialtiesStep(practiceAreas)
    ) {
      form.setValue('specialties', []);
    }

    setStep(nextStep);
  };

  return (
    <SignupMultiStepShell
      step={step}
      stepIndicator={`Etapa ${step} de ${TOTAL_STEPS}`}
      subtitle={stepCopy.subtitle}
      title={stepCopy.title}
      totalSteps={TOTAL_STEPS}>
      <Form {...form}>
        {step === 1 ? <StepBasicData showPasswordErrors={showPasswordErrors} /> : null}
        {step === 2 ? <StepDocumentation /> : null}
        {step === 3 ? <StepAddress /> : null}
        {step === 4 ? <StepOabRegistration /> : null}
        {step === 5 ? <StepEducation /> : null}
        {step === 6 ? <StepPracticeAreas /> : null}
        {step === 7 ? <StepSpecialties /> : null}
        {step === 8 ? <StepServiceRadius /> : null}
        {step === 9 ? <StepBilling /> : null}
        {step === 10 ? <StepAboutYou /> : null}
      </Form>

      <Separator size="xl" />

      <Button
        variant="cta"
        disabled={isSubmitting}
        isLoading={isSubmitting}
        onPress={() => {
          void goNext();
        }}>
        {step === TOTAL_STEPS ? 'Começar' : 'Continuar'}
      </Button>

      <Separator size="sm" />

      <BackLink onPress={goBack} />
    </SignupMultiStepShell>
  );
}
