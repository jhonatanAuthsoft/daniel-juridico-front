import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EyeIcon } from '@/assets/icon/eye';
import { Button } from '@/atomic/button';
import { Form, InputTextField, useForm, useWatch } from '@/atomic/form';
import { PasswordRequirementsFeedback } from '@/atomic/password-requirements-feedback';
import { Separator } from '@/atomic/separator';
import { Body1, Display } from '@/atomic/typography';
import { PasswordRequirements } from '@/constants/password-requirements';
import { FieldValidators } from '@/constants/field-validators';
import { BrandColors, MaxContentWidth, Spacing } from '@/constants/theme';
import { getErrorMessage } from '@/data/http';
import { useResetPassword } from '@/domain/password-recovery';

type NewPasswordFormValues = {
  password: string;
};

function resolveParam(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return (raw ?? '').trim();
}

function NewPasswordField({ showErrors }: { showErrors: boolean }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const password = useWatch<NewPasswordFormValues, 'password'>({ name: 'password' }) ?? '';

  return (
    <View>
      <InputTextField
        name="password"
        label="Nova Senha"
        placeholder="Digite sua senha"
        secureTextEntry={!passwordVisible}
        autoCapitalize="none"
        autoComplete="off"
        textContentType="none"
        importantForAutofill="no"
        validate={FieldValidators.passwordRequirements}
        iconRight={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={passwordVisible ? 'Ocultar senha' : 'Mostrar senha'}
            hitSlop={Spacing.xxs}
            onPress={() => setPasswordVisible((visible) => !visible)}>
            <EyeIcon color={BrandColors.neutral.xlight} />
          </Pressable>
        }
      />
      <Separator size="xxxs" />
      <PasswordRequirementsFeedback
        password={password}
        showErrors={showErrors}
        requirements={PasswordRequirements}
      />
    </View>
  );
}

export default function NewPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; code?: string }>();
  const email = resolveParam(params.email).toLowerCase();
  const code = resolveParam(params.code);
  const resetPassword = useResetPassword();
  const [showErrors, setShowErrors] = useState(false);
  const form = useForm<NewPasswordFormValues>({
    defaultValues: {
      password: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!email || !code) {
      router.replace('/forgot-password');
    }
  }, [email, code, router]);

  const onSubmit = async (values: NewPasswordFormValues) => {
    setShowErrors(true);

    const passwordOk = PasswordRequirements.every((requirement) =>
      requirement.test(values.password),
    );
    if (!passwordOk) {
      Alert.alert('Nova senha', 'A senha não atende aos requisitos mínimos.');
      return;
    }

    try {
      const result = await resetPassword.mutateAsync({
        email,
        code,
        newPassword: values.password,
      });

      Alert.alert(
        'Senha alterada',
        result.message || 'Senha alterada com sucesso',
        [
          {
            text: 'Ir para o login',
            onPress: () => router.replace('/login'),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        'Nova senha',
        getErrorMessage(error, 'Não foi possível redefinir a senha.'),
      );
    }
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
            <Separator size="xxxl" />

            <View style={styles.intro}>
              <Display color={BrandColors.neutral.white}>Nova Senha</Display>
              <Separator size="xxs" />
              <Body1 color={BrandColors.neutral.white} style={styles.subtitle}>
                Cadastre uma nova senha para sua conta
              </Body1>
            </View>

            <Separator size="xxl" />

            <Form {...form}>
              <NewPasswordField showErrors={showErrors} />
            </Form>

            <Separator size="xxl" />

            <Button
              variant="cta"
              disabled={resetPassword.isPending}
              isLoading={resetPassword.isPending}
              onPress={() => {
                void form.handleSubmit(onSubmit)();
              }}>
              Enviar
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
  footer: {
    alignItems: 'center',
  },
});
