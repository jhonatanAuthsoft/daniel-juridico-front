import { StyleSheet, View } from 'react-native';

import { Body1, Body2 } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

import type { ClientNotification } from './mock-client-notifications';

type NotificationCardProps = {
  notification: ClientNotification;
};

export function NotificationCard({ notification }: NotificationCardProps) {
  return (
    <View testID="notification-card" style={styles.card}>
      <Body2 color={BrandColors.neutral.light}>{notification.date}</Body2>
      <Body1 color={BrandColors.neutral.white}>{notification.title}</Body1>
      <Body1 color={BrandColors.neutral.white}>{notification.body}</Body1>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.xxs,
    padding: Spacing.sm,
    borderRadius: Radius.large,
    backgroundColor: BrandColors.accessory.darkGray,
  },
});
