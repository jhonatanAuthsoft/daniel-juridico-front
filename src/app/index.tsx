import { useRouter } from 'expo-router';
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
import { Logo } from '@/assets/icon/logo';
import { Button } from '@/atomic/button';
import { Form, InputTextField, useForm } from '@/atomic/form';
import { Separator } from '@/atomic/separator';
import { Body1, Display, Link as TypographLink } from '@/atomic/typography';
import { InputValidators } from '@/constants/input-validators';
import { BrandColors, MaxContentWidth, Spacing } from '@/constants/theme';

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const handleAccess = () => {
    router.replace('/(tabs)');
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
            <View
              style={styles.brand}
              accessible
              accessibilityRole="image"
              accessibilityLabel="Laweact — Democratização do direito">
              <Logo />
            </View>

            <Separator size="md" />

            <View style={styles.intro}>
              <Display color={BrandColors.neutral.white}>Acesse sua conta</Display>
              <Separator size="xxxs" />
              <Body1 color={BrandColors.neutral.white} style={styles.subtitle}>
                Entre na sua conta e comece a se conectar com quem você procura.
              </Body1>
            </View>

            <Separator size="sm" />

            <Form {...form}>
              <View style={styles.form}>
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

                <InputTextField
                  name="password"
                  label="Senha"
                  placeholder="Digite sua senha"
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                  autoComplete="password"
                  textContentType="password"
                  validators={[InputValidators.minLength3]}
                  iconRight={
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={
                        passwordVisible ? 'Ocultar senha' : 'Mostrar senha'
                      }
                      hitSlop={Spacing.xxs}
                      onPress={() => setPasswordVisible((visible) => !visible)}>
                      <Eye color={BrandColors.neutral.xlight} />
                    </Pressable>
                  }
                />
              </View>
            </Form>

            <Pressable
              accessibilityRole="link"
              onPress={() => {}}
              style={styles.forgotPassword}>
              <TypographLink color={BrandColors.neutral.white}>Esqueceu a senha?</TypographLink>
            </Pressable>

            <Separator size="xl" />

            <Button variant="cta" onPress={handleAccess}>
              Acessar
            </Button>

            <Separator size="lg" />

            <View style={styles.footer}>
              <Button variant="link" linkMode="action" onPress={() => {}}>
                Não tem conta? Cadastre-se
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
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  brand: {
    alignItems: 'center',
  },
  intro: {
    alignItems: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  form: {
    gap: Spacing.sm,
    width: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-start',
    marginTop: Spacing.xxs,
  },
  footer: {
    alignItems: 'center',
  },
});
