import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { LawyerHistoryScreen } from '@/components/lawyer-history';
import { BrandColors, Spacing } from '@/constants/theme';
import {
  mapConnectionToLawyerHistoryItem,
  useConnections,
} from '@/domain/connection';

export default function LawyerHistoricoScreen() {
  const { data: connections = [], isLoading } = useConnections();

  const items = useMemo(
    () =>
      connections
        .map(mapConnectionToLawyerHistoryItem)
        .filter((item): item is NonNullable<typeof item> => item != null),
    [connections],
  );

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={BrandColors.primary.light} size="large" />
      </View>
    );
  }

  return <LawyerHistoryScreen items={items} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BrandColors.neutral.xdark,
    padding: Spacing.lg,
  },
});
