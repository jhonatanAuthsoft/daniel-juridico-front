import { StyleSheet, View } from 'react-native';

import { XIcon } from '@/assets/icon/x';
import { InputCaption } from '@/atomic/typography';
import { BrandColors, Spacing } from '@/constants/theme';

export type PasswordRequirement = {
  id: string;
  label: string;
  test: (value: string) => boolean;
};

export type PasswordRequirementsFeedbackProps = {
  password: string;
  showErrors: boolean;
  requirements: readonly PasswordRequirement[];
};

export function PasswordRequirementsFeedback({
  password,
  showErrors,
  requirements,
}: PasswordRequirementsFeedbackProps) {
  return (
    <View style={styles.requirements}>
      {requirements.map((requirement) => {
        const met = requirement.test(password);
        const isPositive = password.length > 0 && met;
        const isNegative = showErrors && !met;
        const color = isPositive
          ? BrandColors.feedback.success.medium
          : isNegative
            ? BrandColors.feedback.error.light
            : BrandColors.neutral.white;

        return (
          <View key={requirement.id} style={styles.requirementRow}>
            {isNegative ? <XIcon color={BrandColors.feedback.error.medium} /> : null}
            <InputCaption color={color}>{requirement.label}</InputCaption>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  requirements: {
    gap: Spacing.xxxs,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxxs,
  },
});
