import { View } from 'react-native';

import { InputTextField } from '@/atomic/form';
import { Body1 } from '@/atomic/typography';
import { BrandColors } from '@/constants/theme';

import { SelectFieldShell } from '../select-field-shell';
import { signupClientSharedStyles } from '../shared.styles';

export function StepProfessional() {
  return (
    <View style={signupClientSharedStyles.fields}>
      <SelectFieldShell
        name="maritalStatus"
        label="Estado civil"
        placeholder="Selecione o estado civil"
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
