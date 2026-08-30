import { Pressable, StyleSheet, type ViewProps } from 'react-native';
import Animated, { Easing, FadeIn, FadeOut } from 'react-native-reanimated';

import { XIcon } from '@/assets/icon/x';
import { Body2 } from '@/atomic/typography';
import { BrandColors, Spacing } from '@/constants/theme';

export const BANNER_ENTER_MS = 220;
export const BANNER_EXIT_MS = 160;

export type FeedbackBannerVariant = 'error' | 'success' | 'warning';

export type FeedbackBannerProps = ViewProps & {
  message: string;
  variant?: FeedbackBannerVariant;
  onDismiss: () => void;
  /**
   * Inline usage (login) keeps FadeIn/FadeOut so the form holds space
   * during the fade, then reflows after. Overlay host animates the slot
   * instead — pass `false` there to avoid a double fade.
   */
  animated?: boolean;
};

const VARIANT_COLORS = {
  error: {
    background: BrandColors.feedback.error.light,
    foreground: BrandColors.feedback.error.dark,
  },
  success: {
    background: BrandColors.feedback.success.light,
    foreground: BrandColors.feedback.success.dark,
  },
  warning: {
    background: BrandColors.feedback.warning.light,
    foreground: BrandColors.feedback.warning.dark,
  },
} as const;

export function FeedbackBanner({
  message,
  variant = 'error',
  onDismiss,
  animated = true,
  style,
  accessibilityLabel,
  ...rest
}: FeedbackBannerProps) {
  const colors = VARIANT_COLORS[variant];

  return (
    <Animated.View
      {...rest}
      accessibilityRole="alert"
      accessibilityLabel={accessibilityLabel ?? message}
      entering={
        animated
          ? FadeIn.duration(BANNER_ENTER_MS).easing(Easing.out(Easing.quad))
          : undefined
      }
      exiting={
        animated
          ? FadeOut.duration(BANNER_EXIT_MS).easing(Easing.in(Easing.quad))
          : undefined
      }
      style={[styles.root, { backgroundColor: colors.background }, style]}>
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderRadius: 100,
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
