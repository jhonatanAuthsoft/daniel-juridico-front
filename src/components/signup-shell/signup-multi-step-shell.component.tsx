import { useEffect, useRef, type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProgressBar } from '@/atomic/progress-bar';
import { Separator } from '@/atomic/separator';
import { Body1, Body2, Display } from '@/atomic/typography';
import { BrandColors, MaxContentWidth, Spacing } from '@/constants/theme';

export type SignupMultiStepShellProps = {
  step: number;
  totalSteps: number;
  /** e.g. "Etapa 3 de 10" or "Etapa de 3 de 5" */
  stepIndicator: string;
  title: string;
  subtitle: string;
  children: ReactNode;
};

/**
 * Multi-step signup layout: fixed progress/title header, scrollable body below.
 */
export function SignupMultiStepShell({
  step,
  totalSteps,
  stepIndicator,
  title,
  subtitle,
  children,
}: SignupMultiStepShellProps) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [step]);

  return (
    <View style={styles.root}>
      <SafeAreaView
        style={styles.safeArea}
        edges={['top', 'bottom', 'left', 'right']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.column}>
            <View style={styles.header}>
              <ProgressBar step={step} totalSteps={totalSteps} />
              <Separator size="sm" />
              <Body2 color={BrandColors.neutral.white}>{stepIndicator}</Body2>
              <Separator size="xxs" />
              <Display color={BrandColors.neutral.white}>{title}</Display>
              <Separator size="xxxs" />
              <Body1 color={BrandColors.neutral.white}>{subtitle}</Body1>
            </View>

            <ScrollView
              ref={scrollRef}
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              {children}
            </ScrollView>
          </View>
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
  column: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  header: {
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
});
