import { StyleSheet, View } from 'react-native';

import { BrandColors, Radius } from '@/constants/theme';

export type ProgressBarProps = {
  step: number;
  totalSteps: number;
};

export function ProgressBar({ step, totalSteps }: ProgressBarProps) {
  const progress = totalSteps > 0 ? step / totalSteps : 0;

  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  progressTrack: {
    height: 4,
    width: '100%',
    borderRadius: Radius.small,
    backgroundColor: BrandColors.neutral.dark,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: BrandColors.neutral.white,
    borderRadius: Radius.small,
  },
});
