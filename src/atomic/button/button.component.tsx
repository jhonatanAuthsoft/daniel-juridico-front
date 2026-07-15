import { Link as RouterLink, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { CtaGlassBackground, GlassBackground } from '@/atomic/glass';
import { Link as TypographLink } from '@/atomic/typography';
import { BrandColors, CtaButtonTokens, Radius, Spacing } from '@/constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'cta' | 'link';

/** `action` = onPress · `navigation` = expo-router href */
export type ButtonLinkMode = 'action' | 'navigation';

export type ButtonProps = Omit<PressableProps, 'children' | 'disabled'> & {
  variant?: ButtonVariant;
  children: string;
  onPress?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Used when variant is `link` with mode `navigation`. */
  href?: Href;
  /**
   * Link behavior. Defaults to `navigation` when `href` is set, otherwise `action`.
   */
  linkMode?: ButtonLinkMode;
};

export function Button({
  variant = 'primary',
  children,
  onPress,
  isLoading = false,
  disabled = false,
  iconLeft,
  iconRight,
  style,
  href,
  linkMode,
  ...pressableProps
}: ButtonProps) {
  const isDisabled = disabled || isLoading;
  const resolvedLinkMode: ButtonLinkMode =
    linkMode ?? (href != null ? 'navigation' : 'action');
  const isNavigationLink = variant === 'link' && resolvedLinkMode === 'navigation' && href != null;

  const renderContent = (pressed: boolean) => {
    const isPressed = pressed && !isDisabled;
    const textColor = resolveTextColor(variant, isDisabled, isPressed);
    const showSecondaryGlass = variant === 'secondary' && !isPressed && !isDisabled;
    const showCtaGlass = variant === 'cta' && !isDisabled;

    return (
      <View style={variant === 'cta' && !isDisabled ? styles.ctaShadowHost : undefined}>
        <View
          style={[
            styles.base,
            variant === 'primary' && styles.primary,
            variant === 'secondary' && styles.secondary,
            variant === 'cta' && styles.cta,
            variant === 'link' && styles.link,
            isPressed && variant === 'secondary' && styles.secondaryPressed,
            isDisabled && variant === 'primary' && styles.primaryDisabled,
            isDisabled && variant === 'secondary' && styles.secondaryDisabled,
            isDisabled && variant === 'cta' && styles.ctaDisabled,
            isDisabled && variant === 'link' && styles.linkDisabled,
          ]}>
          {showSecondaryGlass ? <GlassBackground blurPx={12.55} /> : null}
          {showCtaGlass ? <CtaGlassBackground pressed={isPressed} /> : null}

          {isPressed && (variant === 'primary' || variant === 'secondary') ? (
            <View pointerEvents="none" style={styles.pressedOverlay} />
          ) : null}

          <View style={[styles.content, variant === 'link' && styles.linkContent]}>
            {isLoading ? (
              <ActivityIndicator color={textColor} size="small" />
            ) : (
              <>
                {iconLeft ? <View style={styles.icon}>{iconLeft}</View> : null}
                <TypographLink color={textColor}>{children}</TypographLink>
                {iconRight ? <View style={styles.icon}>{iconRight}</View> : null}
              </>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (isNavigationLink) {
    return (
      <RouterLink href={href} asChild disabled={isDisabled} style={style}>
        <Pressable
          accessibilityRole="link"
          accessibilityState={{ disabled: isDisabled, busy: isLoading }}
          disabled={isDisabled}
          onPress={onPress}
          {...pressableProps}>
          {({ pressed }) => renderContent(pressed)}
        </Pressable>
      </RouterLink>
    );
  }

  return (
    <Pressable
      accessibilityRole={variant === 'link' ? 'link' : 'button'}
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      disabled={isDisabled}
      onPress={onPress}
      style={style}
      {...pressableProps}>
      {({ pressed }) => renderContent(pressed)}
    </Pressable>
  );
}

function resolveTextColor(variant: ButtonVariant, isDisabled: boolean, isPressed: boolean) {
  if (variant === 'link') {
    return isDisabled ? BrandColors.neutral.light : BrandColors.primary.light;
  }

  if (isDisabled) {
    return BrandColors.neutral.light;
  }

  if (variant === 'cta') {
    return isPressed ? BrandColors.neutral.xlight : BrandColors.neutral.white;
  }

  if (variant === 'secondary' && !isPressed) {
    return BrandColors.primary.light;
  }

  return BrandColors.neutral.xdark;
}

const ctaShadow = Platform.select({
  ios: {
    shadowColor: '#2C2C2C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: CtaButtonTokens.shadow.radius,
  },
  android: {
    elevation: 8,
  },
  default: {
    shadowColor: '#2C2C2C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: CtaButtonTokens.shadow.radius,
  },
});

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: Radius.large,
    alignSelf: 'stretch',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xxs,
    paddingHorizontal: Spacing.sm,
  },
  linkContent: {
    paddingHorizontal: 0,
    justifyContent: 'flex-start',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: BrandColors.primary.light,
  },
  primaryDisabled: {
    backgroundColor: BrandColors.neutral.dark,
  },
  pressedOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.20)',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: BrandColors.primary.light,
  },
  secondaryPressed: {
    backgroundColor: BrandColors.primary.light,
  },
  secondaryDisabled: {
    backgroundColor: BrandColors.neutral.dark,
    opacity: 0.7,
    borderWidth: 2,
    borderColor: BrandColors.neutral.xdark,
  },
  ctaShadowHost: {
    alignSelf: 'stretch',
    borderRadius: Radius.large,
    ...ctaShadow,
  },
  cta: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: CtaButtonTokens.border,
  },
  ctaDisabled: {
    backgroundColor: BrandColors.neutral.dark,
    borderColor: BrandColors.neutral.dark,
  },
  link: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    alignSelf: 'flex-start',
    overflow: 'visible',
  },
  linkDisabled: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
});
