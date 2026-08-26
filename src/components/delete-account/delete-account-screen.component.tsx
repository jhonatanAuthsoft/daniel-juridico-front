import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/atomic/button';
import { Form, InputTextField, useForm } from '@/atomic/form';
import { Body1, Link } from '@/atomic/typography';
import { AccountStackScreen } from '@/components/client-edit-data';
import { BrandColors, Spacing } from '@/constants/theme';

type DeleteAccountForm = {
  confirmation: string;
};

export function DeleteAccountScreen() {
  const router = useRouter();
  const form = useForm<DeleteAccountForm>({
    defaultValues: { confirmation: '' },
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
          autoCapitalize="none"
          autoCorrect={false}
        />
      </Form>

      <View style={styles.actions}>
        <Button variant="cta" onPress={() => router.back()}>
          Desistir
        </Button>
        <Pressable
          accessibilityLabel="Apagar conta"
          accessibilityRole="button"
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
