import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/atomic/button';
import { Separator } from '@/atomic/separator';
import { Body1, Display } from '@/atomic/typography';
import { OptionCheckbox } from '@/components/signup-lawyer';
import { BrandColors, MaxContentWidth, Spacing } from '@/constants/theme';
import { homeHrefForRole, useAuth } from '@/domain/auth';

const TERMS_PARAGRAPHS = [
  {
    id: 'terms-intro',
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
  },
  {
    id: 'terms-body',
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
  },
] as const;

export default function SignupTermsScreen() {
  const router = useRouter();
  const { profile } = useLocalSearchParams<{ profile?: string }>();
  const { signInAs } = useAuth();
  const [accepted, setAccepted] = useState(false);

  const goNext = () => {
    if (profile === 'lawyer') {
      router.push('/signup/subscription');
      return;
    }

    signInAs('CLIENT');
    router.replace(homeHrefForRole('CLIENT'));
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <Display color={BrandColors.neutral.white}>
            Você aceita a Política de Privacidade e os Termos de Uso do aplicativo?
          </Display>

          <Separator size="lg" />

          <View style={styles.paragraphs}>
            {TERMS_PARAGRAPHS.map((paragraph) => (
              <Body1 key={paragraph.id} color={BrandColors.neutral.white}>
                {paragraph.text}
              </Body1>
            ))}
          </View>

          <Separator size="xl" />

          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: accepted }}
            onPress={() => setAccepted((current) => !current)}
            style={({ pressed }) => [styles.acceptRow, pressed && styles.acceptRowPressed]}>
            <OptionCheckbox checked={accepted} />
            <Body1 color={BrandColors.neutral.white} style={styles.acceptText}>
              Aceito os{' '}
              <Text style={styles.termsLink}>Termos de Uso e Política de Privacidade</Text>
            </Body1>
          </Pressable>

          <Separator size="lg" />

          <Button variant="cta" disabled={!accepted} onPress={goNext}>
            Começar
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
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  paragraphs: {
    gap: Spacing.md,
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
