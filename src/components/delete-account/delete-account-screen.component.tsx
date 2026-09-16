import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { EyeIcon } from '@/assets/icon/eye';
import { Button } from '@/atomic/button';
import { useBanner } from '@/atomic/feedback-banner';
import { Form, InputTextField, useForm } from '@/atomic/form';
import { Body1, Link } from '@/atomic/typography';
import { AccountStackScreen } from '@/components/client-edit-data';
import { FieldValidators } from '@/constants/field-validators';
import { BrandColors, Spacing } from '@/constants/theme';
import { getErrorCode, getErrorMessage } from '@/data/http';
import { useAuth, useDeleteAccount } from '@/domain/auth';

type ConfirmationForm = {
  confirmation: string;
};

type PasswordForm = {
  password: string;
};

const CONFIRMATION_PHRASE = 'EXCLUIR MINHA CONTA';

function matchesConfirmationPhrase(value: string): boolean {
  return value.trim().replace(/\s+/g, ' ').toUpperCase() === CONFIRMATION_PHRASE;
}

function PasswordVisibilityToggle({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}
      hitSlop={Spacing.xxs}
      onPress={onToggle}>
      <EyeIcon color={BrandColors.neutral.xlight} />
    </Pressable>
  );
}

export function DeleteAccountScreen() {
  const router = useRouter();
  const banner = useBanner();
  const { signOut } = useAuth();
  const deleteAccount = useDeleteAccount();
  const [step, setStep] = useState<'phrase' | 'password'>('phrase');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const confirmationForm = useForm<ConfirmationForm>({
    defaultValues: { confirmation: '' },
  });
  const passwordForm = useForm<PasswordForm>({
    defaultValues: { password: '' },
  });

  const closeFlow = () => {
    if (deleteAccount.isPending) {
      return;
    }
    router.back();
  };

  const goToPasswordStep = confirmationForm.handleSubmit(() => {
    setPasswordVisible(false);
    passwordForm.reset({ password: '' });
    setStep('password');
  });

  const submitDeletion = passwordForm.handleSubmit(async ({ password }) => {
    try {
      await deleteAccount.mutateAsync({ password });
      banner('Conta deletada com sucesso.', 'success');
      await signOut();
      router.replace('/login');
    } catch (error) {
      const message = getErrorMessage(error, 'Não foi possível excluir a conta.');
      if (getErrorCode(error) === 'INVALID_PASSWORD' || /senha está incorreta/i.test(message)) {
        passwordForm.setError('password', { type: 'server', message });
        return;
      }
      banner(message, 'error');
    }
  });

  if (step === 'password') {
    return (
      <AccountStackScreen
        headerAction="close"
        onBack={() => {
          if (!deleteAccount.isPending) {
            setStep('phrase');
          }
        }}
        title="Confirme sua senha">
        <Body1 color={BrandColors.neutral.white}>
          Por segurança, digite sua senha para concluir a exclusão da conta.
        </Body1>

        <Form {...passwordForm}>
          <InputTextField
            name="password"
            label="Senha"
            placeholder="Digite sua senha"
            accessibilityLabel="Senha"
            secureTextEntry={!passwordVisible}
            autoCapitalize="none"
            autoComplete="password"
            textContentType="password"
            validate={FieldValidators.required('Informe sua senha')}
            iconRight={
              <PasswordVisibilityToggle
                visible={passwordVisible}
                onToggle={() => setPasswordVisible((value) => !value)}
              />
            }
          />
        </Form>

        <Button
          disabled={deleteAccount.isPending}
          isLoading={deleteAccount.isPending}
          variant="cta"
          onPress={() => {
            void submitDeletion();
          }}>
          Continuar
        </Button>
      </AccountStackScreen>
    );
  }

  return (
    <AccountStackScreen headerAction="close" title="Apagar conta" onBack={closeFlow}>
      <Body1 color={BrandColors.neutral.white}>
        Tem certeza de que deseja excluir sua conta? Essa ação é irreversível e todos
        os seus dados, histórico de atendimentos e conexões serão removidos
        permanentemente da plataforma.
      </Body1>
      <Body1 color={BrandColors.neutral.white}>
        Para confirmar, digite{' '}
        <Body1 bold color={BrandColors.neutral.white}>
          EXCLUIR MINHA CONTA
        </Body1>{' '}
        no campo abaixo.
      </Body1>

      <Form {...confirmationForm}>
        <InputTextField
          name="confirmation"
          label={'Digite "Excluir minha conta"'}
          placeholder="Digite a confirmação"
          accessibilityLabel="Confirmação de exclusão"
          autoCapitalize="none"
          autoCorrect={false}
          validate={(value) => {
            if (!value.trim()) {
              return 'Campo obrigatório';
            }
            return matchesConfirmationPhrase(value)
              ? true
              : 'Digite EXCLUIR MINHA CONTA para confirmar.';
          }}
        />
      </Form>

      <View style={styles.actions}>
        <Button variant="cta" onPress={closeFlow}>
          Desistir
        </Button>
        <Pressable
          accessibilityLabel="Apagar conta"
          accessibilityRole="button"
          onPress={() => {
            void goToPasswordStep();
          }}
          style={({ pressed }) => [styles.deleteLink, pressed && styles.pressed]}>
          <Link color={BrandColors.feedback.error.medium}>Apagar conta</Link>
        </Pressable>
      </View>
    </AccountStackScreen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: Spacing.sm,
    width: '100%',
  },
  deleteLink: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});
