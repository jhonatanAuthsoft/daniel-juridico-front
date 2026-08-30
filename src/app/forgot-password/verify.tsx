import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/atomic/button';
import { useBanner } from '@/atomic/feedback-banner';
import { Form, InputOTP, useForm } from '@/atomic/form';
import { Separator } from '@/atomic/separator';
import { Body1, Display, Link as TypographLink } from '@/atomic/typography';
import { BrandColors, MaxContentWidth, Spacing } from '@/constants/theme';
import { getErrorMessage } from '@/data/http';
import {
  useCountdownSeconds,
  useRequestPasswordRecovery,
  useValidateRecoveryCode,
} from '@/domain/password-recovery';

type VerifyCodeFormValues = {
  code: string;
};

function parseWaitSeconds(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
}

function resolveEmail(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return (raw ?? '').trim().toLowerCase();
}

export default function VerifyRecoveryCodeScreen() {
  const router = useRouter();
  const banner = useBanner();
  const params = useLocalSearchParams<{ email?: string; waitSeconds?: string }>();
  const email = resolveEmail(params.email);
  const validateCode = useValidateRecoveryCode();
  const requestRecovery = useRequestPasswordRecovery();
  const { secondsLeft, label, start } = useCountdownSeconds(parseWaitSeconds(params.waitSeconds));

  const form = useForm<VerifyCodeFormValues>({
    defaultValues: {
      code: '',
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    if (!email) {
      router.replace('/forgot-password');
    }
  }, [email, router]);

  const isBusy = validateCode.isPending || requestRecovery.isPending;

  const onSubmit = async (values: VerifyCodeFormValues) => {
    if (!email) {
      return;
    }

    const code = values.code.trim();
    if (!/^\d{4}$/.test(code)) {
      banner('Informe o código de 4 dígitos.', 'warning');
      return;
    }

    try {
      await validateCode.mutateAsync({ email, code });
      router.push({
        pathname: '/forgot-password/new-password',
        params: { email, code },
      });
    } catch (error) {
      banner(
        getErrorMessage(error, 'Código inválido ou expirado. Solicite um novo código.'),
        'error',
      );
    }
  };

  const resendCode = async () => {
    if (!email || secondsLeft > 0 || requestRecovery.isPending) {
      return;
    }

    try {
      const result = await requestRecovery.mutateAsync({ email });
      start(result.waitSeconds);
      banner(
        result.message ||
          'Se existir uma conta com este e-mail, enviaremos um código de redefinição.',
        'success',
      );
    } catch (error) {
      banner(
        getErrorMessage(error, 'Não foi possível reenviar o código.'),
        'error',
      );
    }
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <KeyboardAwareScrollView
          bottomOffset={Spacing.md}
          contentContainerStyle={styles.content}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.flex}>
          <Separator size="xxxl" />

          <View style={styles.intro}>
            <Display color={BrandColors.neutral.white}>Recuperação de Senha</Display>
            <Separator size="xxs" />
            <Body1 color={BrandColors.neutral.white} style={styles.subtitle}>
              Digite o código de 4 dígitos enviado para o e-mail cadastrado
            </Body1>
          </View>

          <Separator size="xl" />

          <Form {...form}>
            <InputOTP name="code" label="Código de recuperação" length={4} />
          </Form>

          <Separator size="xxs" />

          <View style={styles.resendRow}>
            <Pressable
              accessibilityRole="link"
              disabled={secondsLeft > 0 || requestRecovery.isPending}
              onPress={() => {
                void resendCode();
              }}>
              <TypographLink
                color={
                  secondsLeft > 0 ? BrandColors.neutral.medium : BrandColors.neutral.white
                }>
                {secondsLeft > 0
                  ? `Reenviar código (${label})`
                  : requestRecovery.isPending
                    ? 'Reenviando...'
                    : 'Reenviar código'}
              </TypographLink>
            </Pressable>
          </View>

          <Separator size="xxl" />

          <Button
            variant="cta"
            disabled={isBusy}
            isLoading={validateCode.isPending}
            onPress={() => {
              void form.handleSubmit(onSubmit)();
            }}>
            Validar
          </Button>

          <Separator size="xl" />

          <View style={styles.footer}>
            <Button variant="link" href="/login" linkMode="navigation">
              Já tem conta? Acesse
            </Button>
          </View>
        </KeyboardAwareScrollView>
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
