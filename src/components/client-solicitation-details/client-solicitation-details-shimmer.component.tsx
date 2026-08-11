import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/atomic/skeleton';
import { Spacing } from '@/constants/theme';

/**
 * Block shimmers approximating the solicitation detail layout
 * (open data accordion, closed description, lawyers list).
 */
export function ClientSolicitationDetailsShimmer() {
  return (
    <View
      accessibilityLabel="Carregando solicitação"
      accessible
      style={styles.stack}>
      <Skeleton height={400} radius="large" width="100%" />
      <Skeleton height={64} radius="large" width="100%" />
      <Skeleton height={280} radius="large" width="100%" />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    width: '100%',
    gap: Spacing.sm,
  },
});
