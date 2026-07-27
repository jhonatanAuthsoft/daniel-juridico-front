import { useRouter } from 'expo-router';
import { useState } from 'react';

import { BackLink } from '@/atomic/back-link';
import { Button } from '@/atomic/button';
import { Form, useForm } from '@/atomic/form';
import { Separator } from '@/atomic/separator';
import {
  defaultValues,
  STEP_COPY,
  StepAddress,
  StepCredentials,
  StepPersonalDocuments,
  StepProfessional,
  StepProfile,
  TOTAL_STEPS,
  type ClientSignupFormValues,
} from '@/components/signup-client';
import { SignupMultiStepShell } from '@/components/signup-shell';

export default function ClientSignupScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const form = useForm<ClientSignupFormValues>({
    defaultValues,
    mode: 'onBlur',
  });

  const stepCopy = STEP_COPY[step];

  const goBack = () => {
    if (step === 1) {
      router.back();
      return;
    }
    setStep((current) => current - 1);
  };

  const goNext = () => {
    if (step >= TOTAL_STEPS) {
      router.push('/signup/terms?profile=client');
      return;
    }

    setStep((current) => current + 1);
  };

  return (
    <SignupMultiStepShell
      step={step}
      stepIndicator={`Etapa de ${step} de ${TOTAL_STEPS}`}
      subtitle={stepCopy.subtitle}
      title={stepCopy.title}
      totalSteps={TOTAL_STEPS}>
      <Form {...form}>
        {step === 1 ? <StepCredentials showPasswordErrors={false} /> : null}
        {step === 2 ? <StepPersonalDocuments /> : null}
        {step === 3 ? <StepAddress /> : null}
        {step === 4 ? <StepProfessional /> : null}
        {step === 5 ? <StepProfile /> : null}
      </Form>

      <Separator size="xl" />

      <Button variant="cta" onPress={goNext}>
        {step === TOTAL_STEPS ? 'Começar' : 'Continuar'}
      </Button>

      <Separator size="sm" />

      <BackLink onPress={goBack} />
    </SignupMultiStepShell>
  );
}
