import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { EyeIcon } from '@/assets/icon/eye';
import { InputTextField, useWatch } from '@/atomic/form';
import { PasswordRequirementsFeedback } from '@/atomic/password-requirements-feedback';
import { Separator } from '@/atomic/separator';
import { FieldValidators } from '@/constants/field-validators';
import { InputMasks } from '@/constants/input-masks';
import { BrandColors, Spacing } from '@/constants/theme';

import { PASSWORD_REQUIREMENTS } from '../constants';
import { signupLawyerSharedStyles } from '../shared.styles';
import type { LawyerSignupFormValues } from '../types';

export type StepBasicDataProps = {
  showPasswordErrors?: boolean;
};

export function StepBasicData({ showPasswordErrors = false }: StepBasicDataProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const password = useWatch<LawyerSignupFormValues, 'password'>({ name: 'password' }) ?? '';

  return (
    <View style={signupLawyerSharedStyles.fields}>
      <InputTextField
        name="fullName"
        label="Nome completo"
        placeholder="Digite seu nome completo"
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        validate={FieldValidators.required()}
      />
      <InputTextField
        name="email"
        label="E-mail"
        placeholder="Digite seu e-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        validate={FieldValidators.email}
      />
      <InputTextField
        name="phone"
        label="Telefone"
        placeholder="(11) 2222-1214"
        keyboardType="phone-pad"
        autoComplete="tel"
        textContentType="telephoneNumber"
        format={InputMasks.phone}
        validate={FieldValidators.phone}
        maxLength={15}
      />
      <View>
        <InputTextField
          name="password"
          label="Crie uma Senha"
          placeholder="Digite uma senha"
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
          showErrors={showPasswordErrors}
          requirements={PASSWORD_REQUIREMENTS}
        />
      </View>
    </View>
  );
}
