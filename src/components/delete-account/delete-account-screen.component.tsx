import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/atomic/button';
import { useBanner } from '@/atomic/feedback-banner';
import { Form, InputTextField, useForm } from '@/atomic/form';
import { Body1, Link } from '@/atomic/typography';
import { AccountStackScreen } from '@/components/client-edit-data';
import { BrandColors, Spacing } from '@/constants/theme';
import { getErrorMessage } from '@/data/http';
import { useAuth, useDeleteAccount } from '@/domain/auth';

type DeleteAccountForm = {
  confirmation: string;
};

const CONFIRMATION_PHRASE = 'EXCLUIR MINHA CONTA';

function matchesConfirmationPhrase(value: string): boolean {
  return value.trim().replace(/\s+/g, ' ').toUpperCase() === CONFIRMATION_PHRASE;
}

export function DeleteAccountScreen() {
  const router = useRouter();
  const banner = useBanner();
  const { signOut } = useAuth();
  const deleteAccount = useDeleteAccount();
  const form = useForm<DeleteAccountForm>({
    defaultValues: { confirmation: '' },
  });

  const onSubmit = form.handleSubmit(async () => {
    try {
      await deleteAccount.mutateAsync();
      await signOut();
      router.replace('/login');
    } catch (error) {
      banner(
        getErrorMessage(error, 'Não foi possível excluir a conta.'),
        'error',
      );
    }
  });

  return (
    <AccountStackScreen headerAction="close" title="Apagar conta">
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

      <Form {...form}>
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
        <Button
          disabled={deleteAccount.isPending}
          variant="cta"
          onPress={() => router.back()}>
          Desistir
        </Button>
        <Pressable
          accessibilityLabel="Apagar conta"
          accessibilityRole="button"
          accessibilityState={{ disabled: deleteAccount.isPending }}
          disabled={deleteAccount.isPending}
          onPress={() => {
            void onSubmit();
          }}
          style={({ pressed }) => [
            styles.deleteLink,
            pressed && !deleteAccount.isPending && styles.pressed,
            deleteAccount.isPending && styles.disabled,
          ]}>
          <Link color={BrandColors.feedback.error.medium}>
            {deleteAccount.isPending ? 'Excluindo…' : 'Apagar conta'}
          </Link>
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
  disabled: {
    opacity: 0.5,
  },
});
