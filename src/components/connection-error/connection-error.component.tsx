import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { NoInternetIcon } from '@/assets/icon/no-internet';
import { XIcon } from '@/assets/icon/x';
import { Body2, Display, Heading1, Link } from '@/atomic/typography';
import { BrandColors, MaxContentWidth, Radius, Spacing } from '@/constants/theme';

type ConnectionErrorProps = {
  onRetry: () => void;
  isRetrying?: boolean;
  icon?: ReactNode;
  /** Optional screen title shown above the offline state (e.g. "Nova solicitação"). */
  headerTitle?: string;
  onClose?: () => void;
};

const CTA_HEIGHT = 48;

/**
 * Full-screen offline state for actions that require internet.
 */
export function ConnectionError({
  onRetry,
  isRetrying = false,
  icon,
  headerTitle,
  onClose,
}: ConnectionErrorProps) {
  return (
    <View style={styles.root}>
      {headerTitle ? (
        <View style={styles.header}>
          <Display color={BrandColors.neutral.white} style={styles.headerTitle}>
            {headerTitle}
          </Display>
          {onClose ? (
            <Pressable
              accessibilityLabel="Fechar"
              accessibilityRole="button"
              hitSlop={Spacing.xxs}
              onPress={onClose}
              style={({ pressed }) => pressed && styles.pressed}>
              <XIcon color={BrandColors.neutral.white} width={22} height={22} />
            </Pressable>
          ) : (
            <View style={styles.headerSpacer} />
          )}
        </View>
      ) : null}

      <View style={styles.container}>
        <View style={styles.iconSlot}>
          {icon ?? (
            <NoInternetIcon
              testID="no-internet-icon"
              width={36}
              height={36}
              color={BrandColors.neutral.xdark}
            />
          )}
        </View>

        <Heading1 color={BrandColors.neutral.white} style={styles.title}>
          Sem conexão com a internet
        </Heading1>
        <Body2 color={BrandColors.neutral.white} style={styles.message}>
          Parece que você está offline. Verifique sua conexão e tente novamente.
        </Body2>

        <Pressable
          accessibilityLabel="Tente novamente"
          accessibilityRole="button"
          disabled={isRetrying}
          onPress={onRetry}
          style={({ pressed }) => [
            styles.cta,
            pressed && !isRetrying && styles.ctaPressed,
            isRetrying && styles.ctaDisabled,
          ]}>
          {isRetrying ? (
            <ActivityIndicator color={BrandColors.neutral.xdark} />
          ) : (
            <Link color={BrandColors.neutral.xdark}>Tente novamente</Link>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
    minHeight: 48,
  },
  headerTitle: {
    flex: 1,
  },
  headerSpacer: {
    width: 22,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  iconSlot: {
    width: 82,
    height: 82,
    borderRadius: Radius.large,
    backgroundColor: BrandColors.neutral.xlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    maxWidth: 390,
    marginTop: Spacing.xxxs,
    textAlign: 'center',
  },
  cta: {
    alignSelf: 'stretch',
    minHeight: CTA_HEIGHT,
    marginTop: Spacing.sm,
    borderRadius: 100,
    backgroundColor: BrandColors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
  },
  ctaPressed: {
    opacity: 0.88,
  },
  ctaDisabled: {
    opacity: 0.7,
  },
  pressed: {
    opacity: 0.75,
  },
});
