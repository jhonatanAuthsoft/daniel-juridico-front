import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/atomic/button';
import { useBanner } from '@/atomic/feedback-banner';
import { Separator } from '@/atomic/separator';
import { Body1, Display } from '@/atomic/typography';
import { TERMS_SECTIONS } from '@/components/account-terms/legal-terms.data';
import { OptionCheckbox } from '@/components/signup-lawyer';
import { BrandColors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAcceptTerms, useAuth, useLogScreenAccess } from '@/domain/auth';

export default function SignupTermsScreen() {
  const router = useRouter();
  const banner = useBanner();
  const { isAuthenticated, homeHref, user, isHydrating } = useAuth();
  const acceptTerms = useAcceptTerms();
  const [accepted, setAccepted] = useState(false);
  useLogScreenAccess('TERMS');

  if (isHydrating) {
    return null;
  }

  if (isAuthenticated && user?.termsAccepted) {
    return <Redirect href={homeHref} />;
  }

  const goNext = async () => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    try {
      await acceptTerms.mutateAsync({
        checkboxConfirmed: true,
        scrollConfirmed: true,
      });
    } catch (error) {
      banner(
        error instanceof Error
          ? error.message
          : 'Não foi possível registrar o aceite dos termos.',
        'error',
      );
      return;
    }

    router.replace(user?.role === 'LAWYER' ? '/signup/subscription' : homeHref);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <View style={styles.header}>
          <Display color={BrandColors.neutral.white}>
            Você aceita a Política de Privacidade e os Termos de Uso do aplicativo?
          </Display>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator
          keyboardShouldPersistTaps="handled"
          style={styles.scroll}>
          <View style={styles.paragraphs}>
            {TERMS_SECTIONS.map((section) => (
              <View key={section.id} style={styles.section}>
                <Body1 bold color={BrandColors.neutral.white}>
                  {section.title}
                </Body1>
                <Body1 color={BrandColors.neutral.white}>{section.text}</Body1>
              </View>
            ))}
          </View>

          <Separator size="xl" />

          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: accepted }}
            onPress={() => setAccepted((current) => !current)}
            style={({ pressed }) => [
              styles.acceptRow,
              pressed && styles.acceptRowPressed,
            ]}>
            <OptionCheckbox checked={accepted} />
            <Body1 color={BrandColors.neutral.white} style={styles.acceptText}>
              Aceito os{' '}
              <Text style={styles.termsLink}>
                Termos de Uso e Política de Privacidade
              </Text>
            </Body1>
          </Pressable>

          <Separator size="lg" />

          <Button
            variant="cta"
            disabled={!accepted || acceptTerms.isPending}
            onPress={() => {
              void goNext();
            }}>
            {acceptTerms.isPending ? 'Salvando...' : 'Começar'}
          </Button>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BrandColors.neutral.xdark,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  paragraphs: {
    gap: Spacing.lg,
  },
  section: {
    gap: Spacing.xs,
  },
  acceptRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  acceptRowPressed: {
    opacity: 0.88,
  },
  acceptText: {
    flex: 1,
  },
  termsLink: {
    color: BrandColors.primary.light,
    textDecorationLine: 'underline',
  },
});
