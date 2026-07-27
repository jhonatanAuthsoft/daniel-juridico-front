import { useRouter } from 'expo-router';
import { type ReactNode, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LogoIcon } from '@/assets/icon/logo';
import { Button } from '@/atomic/button';
import { Separator } from '@/atomic/separator';
import { Body1, Body2, Display } from '@/atomic/typography';
import { useSplashGate } from '@/components/splash-guard';
import { BrandColors, MaxContentWidth, Radius, Spacing } from '@/constants/theme';

export type DevelopmentGuardProps = {
  children: ReactNode;
  /** When false, children render normally. Defaults to true. */
  enabled?: boolean;
};

/**
 * Blocks nested routes and shows an under-development screen.
 * Place in a layout to gate that branch of the app.
 */
export function DevelopmentGuard({
  children,
  enabled = true,
}: DevelopmentGuardProps) {
  const router = useRouter();
  const splashGate = useSplashGate();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const timeoutId = setTimeout(() => {
      splashGate?.markContentReady();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [enabled, splashGate]);

  if (!enabled) {
    return children;
  }

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/login');
  };

  return (
    <View
      accessibilityLabel="Aplicativo em desenvolvimento"
      accessibilityRole="summary"
      style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <View style={styles.content}>
          <LogoIcon width={160} height={67} />

          <Separator size="xl" />

          <View style={styles.badge}>
            <Body2 color={BrandColors.neutral.xdark}>Em desenvolvimento</Body2>
          </View>

          <Separator size="sm" />

          <Display color={BrandColors.neutral.white} style={styles.title}>
            Estamos construindo o restante do app
          </Display>

          <Separator size="xxs" />

          <Body1 color={BrandColors.neutral.light} style={styles.description}>
            Esta área ainda não está disponível. Volte em breve para acompanhar
            as novidades.
          </Body1>

          <Separator size="lg" />

          <Button
            accessibilityLabel="Voltar"
            onPress={goBack}
            variant="primary">
            Voltar
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}


const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BrandColors.neutral.xdark,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxxs,
    borderRadius: Radius.large,
    backgroundColor: BrandColors.primary.light,
  },
  title: {
    maxWidth: 320,
  },
  description: {
    maxWidth: 320,
  },
});
