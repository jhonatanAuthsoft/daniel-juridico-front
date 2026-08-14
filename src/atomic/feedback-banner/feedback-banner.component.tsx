import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { XIcon } from '@/assets/icon/x';
import { Body2 } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

export type FeedbackBannerVariant = 'error';

export type FeedbackBannerProps = ViewProps & {
  message: string;
  variant?: FeedbackBannerVariant;
  onDismiss: () => void;
};

const VARIANT_COLORS = {
  error: {
    background: BrandColors.feedback.error.light,
    foreground: BrandColors.feedback.error.dark,
  },
} as const;

export function FeedbackBanner({
  message,
  variant = 'error',
  onDismiss,
  style,
  accessibilityLabel,
  ...rest
}: FeedbackBannerProps) {
  const colors = VARIANT_COLORS[variant];

  return (
    <View
      accessibilityRole="alert"
      accessibilityLabel={accessibilityLabel ?? message}
      style={[styles.root, { backgroundColor: colors.background }, style]}
      {...rest}>
      <Body2 color={colors.foreground} style={styles.message}>
        {message}
      </Body2>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Fechar"
        hitSlop={Spacing.xxs}
        onPress={onDismiss}
        style={styles.dismiss}>
        <XIcon color={colors.foreground} width={16} height={16} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderRadius: Radius.large,
    paddingVertical: Spacing.xs,
    paddingLeft: Spacing.sm,
    paddingRight: Spacing.xs,
    width: '100%',
  },
  message: {
    flex: 1,
  },
  dismiss: {
    padding: Spacing.xxs,
  },
});
