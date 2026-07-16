import { View } from 'react-native';

import { Body1 } from '@/atomic/typography';
import { BrandColors } from '@/constants/theme';

import { signupLawyerSharedStyles } from '../shared.styles';

export type StepPlaceholderProps = {
  step: number;
};

export function StepPlaceholder({ step }: StepPlaceholderProps) {
  return (
    <View style={signupLawyerSharedStyles.fields}>
      <Body1 color={BrandColors.neutral.light}>Conteúdo da etapa {step} em breve.</Body1>
    </View>
  );
}
