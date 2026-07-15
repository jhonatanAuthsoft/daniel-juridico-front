import { useRouter } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/atomic/button';
import { Form, InputOTP, useForm } from '@/atomic/form';
import { Separator } from '@/atomic/separator';
import { Body1, Display, Link as TypographLink } from '@/atomic/typography';
import { BrandColors, MaxContentWidth, Spacing } from '@/constants/theme';

type VerifyCodeFormValues = {
  code: string;
};

export default function VerifyRecoveryCodeScreen() {
  const router = useRouter();
  const form = useForm<VerifyCodeFormValues>({
    defaultValues: {
      code: '',
    },
    mode: 'onBlur',
  });

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
            <Separator size="xxxl" />

            <View style={styles.intro}>
              <Display color={BrandColors.neutral.white}>Recuperação de Senha</Display>
              <Separator size="xxs" />
              <Body1 color={BrandColors.neutral.white} style={styles.subtitle}>
                Informe seu e-mail cadastrado para receber um código de recuperação da sua
                conta
              </Body1>
            </View>

            <Separator size="xl" />

            <Form {...form}>
              <InputOTP name="code" label="Código de recuperação" length={4} />
            </Form>

            <Separator size="xxs" />

            <View style={styles.resendRow}>
              <Pressable accessibilityRole="link" onPress={() => {}}>
                <TypographLink color={BrandColors.neutral.white}>Reenviar código</TypographLink>
              </Pressable>
            </View>

            <Separator size="xxl" />

            <Button
              variant="cta"
              onPress={() => router.push('/forgot-password/new-password')}>
              Validar
            </Button>

            <Separator size="xl" />

            <View style={styles.footer}>
              <Button variant="link" href="/login" linkMode="navigation">
                Já tem conta? Acesse
              </Button>
            </View>
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
    paddingBottom: Spacing.sm,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  intro: {
    alignItems: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  resendRow: {
    alignItems: 'flex-end',
  },
  footer: {
    alignItems: 'center',
  },
});
