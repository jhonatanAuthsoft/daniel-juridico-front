import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackLink } from '@/atomic/back-link';
import { Button } from '@/atomic/button';
import { Form, useForm } from '@/atomic/form';
import { ProgressBar } from '@/atomic/progress-bar';
import { Separator } from '@/atomic/separator';
import { Body1, Body2, Display } from '@/atomic/typography';
import {
  defaultValues,
  STEP_COPY,
  StepAboutYou,
  StepAddress,
  StepBasicData,
  StepBilling,
  StepDocumentation,
  StepEducation,
  StepOabRegistration,
  StepPlaceholder,
  StepPracticeAreas,
  StepSpecialties,
  TOTAL_STEPS,
  type LawyerSignupFormValues,
} from '@/components/signup-lawyer';
import { BrandColors, MaxContentWidth, Spacing } from '@/constants/theme';

export default function LawyerSignupScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const form = useForm<LawyerSignupFormValues>({
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
      router.push('/signup/terms?profile=lawyer');
      return;
    }

    setStep((current) => current + 1);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <ProgressBar step={step} totalSteps={TOTAL_STEPS} />
            <Separator size="sm" />
            <Body2 color={BrandColors.neutral.white}>
              Etapa {step} de {TOTAL_STEPS}
            </Body2>
            <Separator size="xxs" />
            <Display color={BrandColors.neutral.white}>{stepCopy.title}</Display>
            <Separator size="xxxs" />
            <Body1 color={BrandColors.neutral.white}>{stepCopy.subtitle}</Body1>

            <Separator size="lg" />

            <Form {...form}>
              {step === 1 ? <StepBasicData showPasswordErrors={false} /> : null}
              {step === 2 ? <StepDocumentation /> : null}
              {step === 3 ? <StepAddress /> : null}
              {step === 4 ? <StepOabRegistration /> : null}
              {step === 5 ? <StepEducation /> : null}
              {step === 6 ? <StepPracticeAreas /> : null}
              {step === 7 ? <StepPlaceholder step={step} /> : null}
              {step === 8 ? <StepSpecialties /> : null}
              {step === 9 ? <StepBilling /> : null}
              {step === 10 ? <StepAboutYou /> : null}
            </Form>

            <Separator size="xl" />

            <Button variant="cta" onPress={goNext}>
              {step === TOTAL_STEPS ? 'Começar' : 'Continuar'}
            </Button>

            <Separator size="sm" />

            <BackLink onPress={goBack} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BrandColors.neutral.xdark,
  },
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
});
