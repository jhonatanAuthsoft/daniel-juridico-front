import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CheckedCheckboxIcon } from '@/assets/icon/checked-checkbox';
import { Separator } from '@/atomic/separator';
import { Body1, Display } from '@/atomic/typography';
import { BrandColors, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { homeHrefForRole, useAuth } from '@/domain/auth';

const REDIRECT_DELAY_MS = 2500;

export default function SignupSubscriptionConfirmedScreen() {
  const router = useRouter();
  const { signInAs } = useAuth();

  useEffect(() => {
    signInAs('LAWYER');

    const timeoutId = setTimeout(() => {
      router.replace(homeHrefForRole('LAWYER'));
    }, REDIRECT_DELAY_MS);

    return () => clearTimeout(timeoutId);
  }, [router, signInAs]);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <View style={styles.content}>
          <View style={styles.iconBadge}>
            <CheckedCheckboxIcon width={40} height={40} color={BrandColors.neutral.black} />
          </View>

          <Separator size="md" />

          <Display color={BrandColors.neutral.white} style={styles.centeredText}>
            Assinatura confirmada!
          </Display>

          <Separator size="sm" />

          <Body1 color={BrandColors.neutral.white} style={styles.centeredText}>
            Em alguns instantes, você será direcionado para a pagina inicial do aplicativo.
          </Body1>
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
    paddingHorizontal: Spacing.sm,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBadge: {
    width: 72,
    height: 72,
    borderRadius: Radius.large,
    backgroundColor: BrandColors.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredText: {
    textAlign: 'center',
  },
});
