import { Pressable, StyleSheet, View } from 'react-native';

import { Body1, Body2 } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';
import {
  formatNotificationDate,
  type NotificationResult,
} from '@/data/notification';

type NotificationCardProps = {
  notification: NotificationResult;
  onPress?: (notification: NotificationResult) => void;
};

export function NotificationCard({
  notification,
  onPress,
}: NotificationCardProps) {
  return (
    <Pressable
      accessibilityLabel={notification.title}
      accessibilityRole="button"
      accessibilityState={{ selected: !notification.isUnread }}
      disabled={!onPress}
      onPress={() => onPress?.(notification)}
      style={({ pressed }) => [
        styles.card,
        notification.isUnread && styles.unread,
        pressed && onPress ? styles.pressed : null,
      ]}
      testID="notification-card">
      <View style={styles.headerRow}>
        <Body2 color={BrandColors.neutral.light}>
          {formatNotificationDate(notification.createdAt)}
        </Body2>
        {notification.isUnread ? (
          <View
            accessibilityLabel="Não lida"
            style={styles.unreadDot}
            testID="notification-unread-dot"
          />
        ) : null}
      </View>
      <Body1 color={BrandColors.neutral.white}>{notification.title}</Body1>
      <Body1 color={BrandColors.neutral.white}>{notification.body}</Body1>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.xxs,
    padding: Spacing.sm,
    borderRadius: Radius.large,
    backgroundColor: BrandColors.accessory.darkGray,
  },
  unread: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BrandColors.primary.light,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BrandColors.primary.light,
  },
  pressed: {
    opacity: 0.75,
  },
});
