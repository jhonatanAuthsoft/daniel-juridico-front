import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/atomic/skeleton';
import { Separator } from '@/atomic/separator';
import { Spacing } from '@/constants/theme';

const SHIMMER_KEYS = [
  'notification-shimmer-a',
  'notification-shimmer-b',
  'notification-shimmer-c',
  'notification-shimmer-d',
] as const;

/** Shimmer mirroring {@link NotificationCard} height. */
export function NotificationCardShimmer() {
  return <Skeleton height={120} radius="large" width="100%" />;
}

export function NotificationsListShimmer() {
  return (
    <View style={styles.root}>
      {SHIMMER_KEYS.map((key, index) => (
        <View key={key}>
          {index > 0 ? <Separator size="sm" /> : null}
          <NotificationCardShimmer />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 0,
    paddingBottom: Spacing.sm,
  },
});
