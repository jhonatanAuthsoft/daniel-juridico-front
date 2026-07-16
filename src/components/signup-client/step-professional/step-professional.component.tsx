import { View } from 'react-native';

import { InputSelectField, InputTextField } from '@/atomic/form';
import { Body1 } from '@/atomic/typography';
import { MARITAL_STATUS_OPTIONS } from '@/constants/select-options';
import { BrandColors } from '@/constants/theme';

import { signupClientSharedStyles } from '../shared.styles';

export function StepProfessional() {
  return (
    <View style={signupClientSharedStyles.fields}>
      <InputSelectField
        name="maritalStatus"
        label="Estado civil"
        placeholder="Selecione o estado civil"
        options={MARITAL_STATUS_OPTIONS}
      />
      <InputTextField
        name="profession"
        label="Profissão"
        placeholder="Digite sua profissão"
        autoCapitalize="sentences"
      />
      <InputTextField
        name="monthlyIncome"
        label="Renda mensal"
        placeholder="Ex. 180,00"
        keyboardType="decimal-pad"
        iconLeft={<Body1 color={BrandColors.neutral.light}>$</Body1>}
      />
    </View>
  );
}
