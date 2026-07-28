import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

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
import { getClientSignupStepFields } from '@/components/signup-client/step-fields';
import { SignupMultiStepShell } from '@/components/signup-shell';
import { useRegisterClient } from '@/domain/client';

export default function ClientSignupScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPasswordErrors, setShowPasswordErrors] = useState(false);
  const form = useForm<ClientSignupFormValues>({
    defaultValues,
    mode: 'onBlur',
  });
  const registerClient = useRegisterClient();

  const stepCopy = STEP_COPY[step];
  const isLastStep = step >= TOTAL_STEPS;
  const isSubmitting = registerClient.isPending;

  const goBack = () => {
    if (isSubmitting) {
      return;
    }
    if (step === 1) {
      router.back();
      return;
    }
    setStep((current) => current - 1);
  };

  const submitRegistration = form.handleSubmit(async (values) => {
    try {
      await registerClient.mutateAsync(values);
      router.push('/signup/terms?profile=client');
    } catch (error) {
      Alert.alert(
        'Cadastro',
        error instanceof Error ? error.message : 'Não foi possível concluir o cadastro.',
      );
    }
  });

  const goNext = async () => {
    const personType = form.getValues('personType');
    const fields = getClientSignupStepFields(step, personType);
    if (step === 1) {
      setShowPasswordErrors(true);
    }
    const valid = await form.trigger(fields);
    if (!valid) {
      return;
    }

    if (isLastStep) {
      void submitRegistration();
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
        {step === 1 ? <StepCredentials showPasswordErrors={showPasswordErrors} /> : null}
        {step === 2 ? <StepPersonalDocuments /> : null}
        {step === 3 ? <StepAddress /> : null}
        {step === 4 ? <StepProfessional /> : null}
        {step === 5 ? <StepProfile /> : null}
      </Form>

      <Separator size="xl" />

      <Button variant="cta" disabled={isSubmitting} isLoading={isSubmitting} onPress={() => void goNext()}>
        {isLastStep ? 'Começar' : 'Continuar'}
      </Button>

      <Separator size="sm" />

      <BackLink onPress={goBack} />
    </SignupMultiStepShell>
  );
}
