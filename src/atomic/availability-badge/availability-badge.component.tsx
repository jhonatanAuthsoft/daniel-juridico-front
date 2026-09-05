import { StyleSheet, View } from 'react-native';

import { Body2 } from '@/atomic/typography';
import { BrandColors, Spacing } from '@/constants/theme';

type AvailabilityBadgeProps = {
  available: boolean;
};

export function AvailabilityBadge({ available }: AvailabilityBadgeProps) {
  return (
    <View style={styles.row}>
      <View
        style={[
          styles.dot,
          {
            backgroundColor: available
              ? BrandColors.feedback.success.medium
              : BrandColors.feedback.error.medium,
          },
        ]}
      />
      <Body2 color={BrandColors.neutral.light}>
        {available ? 'Disponível' : 'Indisponível'}
      </Body2>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxxs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
