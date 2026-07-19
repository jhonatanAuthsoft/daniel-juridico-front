import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { BrandColors, Radius, Spacing } from '@/constants/theme';

type ClientConnectionStatusCardProps = {
  children: ReactNode;
};

export function ClientConnectionStatusCard({
  children,
}: ClientConnectionStatusCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.accent} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 120,
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: Radius.medium,
    backgroundColor: BrandColors.neutral.dark,
  },
  accent: {
    width: 6,
    backgroundColor: BrandColors.primary.light,
  },
  content: {
    flex: 1,
    gap: Spacing.xs,
    padding: Spacing.sm,
  },
});
