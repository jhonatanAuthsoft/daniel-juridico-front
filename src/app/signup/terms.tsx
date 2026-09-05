import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/atomic/button';
import { useBanner } from '@/atomic/feedback-banner';
import { Separator } from '@/atomic/separator';
import { Body1, Display } from '@/atomic/typography';
import { OptionCheckbox } from '@/components/signup-lawyer';
import { BrandColors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAcceptTerms, useAuth } from '@/domain/auth';

const LOREM_BLOCK =
  'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.';

const TERMS_SECTIONS = [
  {
    id: 'terms-1',
    title: '1. Introdução',
    text: LOREM_BLOCK,
  },
  {
    id: 'terms-2',
    title: '2. Cadastro e conta',
    text: `${LOREM_BLOCK} ${LOREM_BLOCK}`,
  },
  {
    id: 'terms-3',
    title: '3. Uso da plataforma',
    text: `${LOREM_BLOCK} ${LOREM_BLOCK}`,
  },
  {
    id: 'terms-4',
    title: '4. Responsabilidades do usuário',
    text: `${LOREM_BLOCK} ${LOREM_BLOCK} ${LOREM_BLOCK}`,
  },
  {
    id: 'terms-5',
    title: '5. Privacidade e dados pessoais',
    text: `${LOREM_BLOCK} ${LOREM_BLOCK}`,
  },
  {
    id: 'terms-6',
    title: '6. Conteúdo e comunicações',
    text: `${LOREM_BLOCK} ${LOREM_BLOCK}`,
  },
  {
    id: 'terms-7',
    title: '7. Limitações de responsabilidade',
    text: `${LOREM_BLOCK} ${LOREM_BLOCK} ${LOREM_BLOCK}`,
  },
  {
    id: 'terms-8',
    title: '8. Encerramento e alterações',
    text: `${LOREM_BLOCK} ${LOREM_BLOCK}`,
  },
  {
    id: 'terms-9',
    title: '9. Lei aplicável',
    text: LOREM_BLOCK,
  },
  {
    id: 'terms-10',
    title: '10. Contato',
    text: `${LOREM_BLOCK} Ao final deste documento, confirme que leu integralmente os Termos de Uso e a Política de Privacidade antes de marcar o aceite abaixo.`,
  },
] as const;

export default function SignupTermsScreen() {
  const router = useRouter();
  const banner = useBanner();
  const { profile } = useLocalSearchParams<{ profile?: string }>();
  const { isAuthenticated, homeHref, user, isHydrating } = useAuth();
  const acceptTerms = useAcceptTerms();
  const [accepted, setAccepted] = useState(false);

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

    if (profile === 'lawyer') {
      router.push('/signup/subscription');
      return;
    }

    router.replace(homeHref);
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
