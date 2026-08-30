import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';

import { EyeIcon } from '@/assets/icon/eye';
import { Button } from '@/atomic/button';
import { useBanner } from '@/atomic/feedback-banner';
import { Form, InputTextField, useForm, useWatch } from '@/atomic/form';
import { PasswordRequirementsFeedback } from '@/atomic/password-requirements-feedback';
import { Separator } from '@/atomic/separator';
import { AccountStackScreen } from '@/components/client-edit-data';
import { FieldValidators } from '@/constants/field-validators';
import { PasswordRequirements } from '@/constants/password-requirements';
import { BrandColors, Spacing } from '@/constants/theme';
import { getErrorMessage } from '@/data/http';
import { useUpdatePassword } from '@/domain/auth';

type ChangePasswordForm = {
  currentPassword: string;
  newPassword: string;
};

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

function ChangePasswordFields({ showErrors }: { showErrors: boolean }) {
  const [currentVisible, setCurrentVisible] = useState(false);
  const [newVisible, setNewVisible] = useState(false);
  const newPassword =
    useWatch<ChangePasswordForm, 'newPassword'>({ name: 'newPassword' }) ?? '';

  return (
    <View style={{ gap: Spacing.sm, width: '100%' }}>
      <InputTextField
        name="currentPassword"
        label="Senha atual"
        accessibilityLabel="Senha atual"
        secureTextEntry={!currentVisible}
        autoCapitalize="none"
        autoComplete="off"
        textContentType="none"
        importantForAutofill="no"
        validate={FieldValidators.required()}
        iconRight={
          <PasswordVisibilityToggle
            visible={currentVisible}
            onToggle={() => setCurrentVisible((value) => !value)}
          />
        }
      />
      <View>
        <InputTextField
          name="newPassword"
          label="Nova Senha"
          accessibilityLabel="Nova Senha"
          placeholder="Digite uma nova senha"
          secureTextEntry={!newVisible}
          autoCapitalize="none"
          autoComplete="off"
          textContentType="none"
          importantForAutofill="no"
          validate={FieldValidators.passwordRequirements}
          iconRight={
            <PasswordVisibilityToggle
              visible={newVisible}
              onToggle={() => setNewVisible((value) => !value)}
            />
          }
        />
        <Separator size="xxxs" />
        <PasswordRequirementsFeedback
          password={newPassword}
          showErrors={showErrors}
          requirements={PasswordRequirements}
        />
      </View>
    </View>
  );
}

export function ChangePasswordScreen() {
  const router = useRouter();
  const banner = useBanner();
  const updatePassword = useUpdatePassword();
  const [showErrors, setShowErrors] = useState(false);
  const form = useForm<ChangePasswordForm>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setShowErrors(true);
    if (values.currentPassword === values.newPassword) {
      banner('A nova senha deve ser diferente da senha atual.', 'warning');
      return;
    }

    try {
      await updatePassword.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      router.back();
    } catch (error) {
      banner(
        getErrorMessage(error, 'Não foi possível alterar a senha.'),
        'error',
      );
    }
  });

  return (
    <AccountStackScreen title="Alterar senha">
      <Form {...form}>
        <ChangePasswordFields showErrors={showErrors} />
      </Form>
      <Button
        disabled={updatePassword.isPending}
        isLoading={updatePassword.isPending}
        onPress={() => {
          setShowErrors(true);
          void onSubmit();
        }}
        variant="cta">
        Salvar alterações
      </Button>
    </AccountStackScreen>
  );
}
