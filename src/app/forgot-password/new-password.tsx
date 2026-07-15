import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Eye } from '@/assets/icon/eye';
import { XIcon } from '@/assets/icon/x';
import { Button } from '@/atomic/button';
import { Form, InputTextField, useForm, useWatch } from '@/atomic/form';
import { Separator } from '@/atomic/separator';
import { Body1, Display, InputCaption } from '@/atomic/typography';
import { BrandColors, MaxContentWidth, Spacing } from '@/constants/theme';

type NewPasswordFormValues = {
  password: string;
};

const PASSWORD_REQUIREMENTS = [
  {
    id: 'min-length',
    label: 'Mínimo de 8 caracteres',
    test: (value: string) => value.length >= 8,
  },
  {
    id: 'has-number',
    label: 'Pelo menos um número',
    test: (value: string) => /\d/.test(value),
  },
  {
    id: 'has-uppercase',
    label: 'Pelo menos uma letra maiúscula',
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    id: 'has-lowercase',
    label: 'Pelo menos uma letra minúscula',
    test: (value: string) => /[a-z]/.test(value),
  },
] as const;

function PasswordRequirementsFeedback({
  password,
  showErrors,
}: {
  password: string;
  showErrors: boolean;
}) {
  return (
    <View style={styles.requirements}>
      {PASSWORD_REQUIREMENTS.map((requirement) => {
        const met = requirement.test(password);
        const isPositive = password.length > 0 && met;
        const isNegative = showErrors && !met;

        const color = isPositive
          ? BrandColors.feedback.success.medium
          : isNegative
            ? BrandColors.feedback.error.light
            : BrandColors.neutral.white;

        return (
          <View key={requirement.id} style={styles.requirementRow}>
            {isNegative ? <XIcon color={BrandColors.feedback.error.medium} /> : null}
            <InputCaption color={color}>{requirement.label}</InputCaption>
          </View>
        );
      })}
    </View>
  );
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
        autoComplete="new-password"
        textContentType="newPassword"
        validators={[]}
        iconRight={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={passwordVisible ? 'Ocultar senha' : 'Mostrar senha'}
            hitSlop={Spacing.xxs}
            onPress={() => setPasswordVisible((visible) => !visible)}>
            <Eye color={BrandColors.neutral.xlight} />
          </Pressable>
        }
      />
      <Separator size="xxxs" />
      <PasswordRequirementsFeedback password={password} showErrors={showErrors} />
    </View>
  );
}

export default function NewPasswordScreen() {
  const [showErrors, setShowErrors] = useState(false);
  const form = useForm<NewPasswordFormValues>({
    defaultValues: {
      password: '',
    },
    mode: 'onChange',
  });

  const handleSubmit = () => {
    setShowErrors(true);
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

            <Button variant="cta" onPress={handleSubmit}>
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
  requirements: {
    gap: Spacing.xxxs,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxxs,
  },
  footer: {
    alignItems: 'center',
  },
});
