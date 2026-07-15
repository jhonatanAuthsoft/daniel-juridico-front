import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { EyeIcon } from '@/assets/icon/eye';
import { InputTextField, useWatch } from '@/atomic/form';
import { PasswordRequirementsFeedback } from '@/atomic/password-requirements-feedback';
import { Separator } from '@/atomic/separator';
import { BrandColors, Spacing } from '@/constants/theme';

import { PASSWORD_REQUIREMENTS } from '../constants';
import { signupClientSharedStyles } from '../shared.styles';
import type { ClientSignupFormValues } from '../types';

export type StepCredentialsProps = {
  showPasswordErrors: boolean;
};

export function StepCredentials({ showPasswordErrors }: StepCredentialsProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const password = useWatch<ClientSignupFormValues, 'password'>({ name: 'password' }) ?? '';

  return (
    <View style={signupClientSharedStyles.fields}>
      <InputTextField
        name="email"
        label="E-mail"
        placeholder="Digite seu e-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
      />
      <InputTextField
        name="phone"
        label="Telefone"
        placeholder="(11) 2222-1214"
        keyboardType="phone-pad"
        autoComplete="tel"
        textContentType="telephoneNumber"
      />
      <View>
        <InputTextField
          name="password"
          label="Crie uma Senha"
          placeholder="Digite uma senha"
          secureTextEntry={!passwordVisible}
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
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
          showErrors={showPasswordErrors}
          requirements={PASSWORD_REQUIREMENTS}
        />
      </View>
    </View>
  );
}
