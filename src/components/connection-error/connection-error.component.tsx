import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { NoInternetIcon } from '@/assets/icon/no-internet';
import { Button } from '@/atomic/button';
import { Body1, Display } from '@/atomic/typography';
import { BrandColors, MaxContentWidth, Radius, Spacing } from '@/constants/theme';

type ConnectionErrorProps = {
  onRetry: () => void;
  isRetrying?: boolean;
  icon?: ReactNode;
};

export function ConnectionError({
  onRetry,
  isRetrying = false,
  icon,
}: ConnectionErrorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconSlot}>
        {icon ?? (
          <NoInternetIcon
            testID="no-internet-icon"
            width={72}
            height={72}
            color={BrandColors.neutral.xdark}
          />
        )}
      </View>

      <Display color={BrandColors.neutral.white} style={styles.title}>
        Sem conexão com a internet
      </Display>
      <Body1 color={BrandColors.neutral.white} style={styles.message}>
        Parece que você está offline. Verifique sua conexão e tente novamente.
      </Body1>

      <Button
        accessibilityLabel="Tente novamente"
        isLoading={isRetrying}
        onPress={onRetry}
        style={styles.button}>
        Tente novamente
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  iconSlot: {
    width: 152,
    height: 152,
    borderRadius: Radius.large,
    backgroundColor: BrandColors.neutral.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    marginTop: Spacing.xxs,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginTop: Spacing.lg,
  },
});
