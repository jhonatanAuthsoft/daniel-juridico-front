import { useRouter } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/atomic/button';
import { Form, InputTextField, useForm } from '@/atomic/form';
import { Separator } from '@/atomic/separator';
import { Body1, Display } from '@/atomic/typography';
import { InputValidators } from '@/constants/input-validators';
import { BrandColors, MaxContentWidth, Spacing } from '@/constants/theme';

type ForgotPasswordFormValues = {
  email: string;
};

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const form = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: '',
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
              <InputTextField
                name="email"
                label="E-mail"
                placeholder="Digite seu e-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                validators={[InputValidators.email]}
              />
            </Form>

            <Separator size="xxl" />

            <Button variant="cta" onPress={() => router.push('/forgot-password/verify')}>
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
