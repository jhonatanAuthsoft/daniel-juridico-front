import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CaretLeftIcon } from '@/assets/icon/caret-left';
import { XIcon } from '@/assets/icon/x';
import { Body1 } from '@/atomic/typography';
import { getTabBarTotalHeight } from '@/components/app-tab-bar';
import { BrandColors, MaxContentWidth, Spacing } from '@/constants/theme';

type AccountStackScreenProps = {
  title: string;
  children: ReactNode;
  headerAction?: 'back' | 'close';
};

/**
 * Nested Perfil-tab layout: back + title on the left, padding above the tab bar.
 */
export function AccountStackScreen({
  title,
  children,
  headerAction = 'back',
}: AccountStackScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const paddingBottom = getTabBarTotalHeight(insets.bottom) + Spacing.md;
  const goBack = () => router.back();

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        {headerAction === 'back' ? (
          <>
            <Pressable
              accessibilityLabel="Voltar"
              accessibilityRole="button"
              hitSlop={Spacing.xxs}
              onPress={goBack}
              style={({ pressed }) => pressed && styles.pressed}>
              <CaretLeftIcon color={BrandColors.neutral.white} height={24} width={24} />
            </Pressable>
            <Body1 color={BrandColors.neutral.white} numberOfLines={1} style={styles.title}>
              {title}
            </Body1>
          </>
        ) : (
          <>
            <Body1 color={BrandColors.neutral.white} numberOfLines={1} style={styles.title}>
              {title}
            </Body1>
            <Pressable
              accessibilityLabel="Fechar"
              accessibilityRole="button"
              hitSlop={Spacing.xxs}
              onPress={goBack}
              style={({ pressed }) => pressed && styles.pressed}>
              <XIcon color={BrandColors.neutral.white} width={24} height={24} />
            </Pressable>
          </>
        )}
      </View>
      <KeyboardAwareScrollView
        bottomOffset={Spacing.md}
        contentContainerStyle={[styles.content, { paddingBottom }]}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.flex}>
        {children}
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BrandColors.neutral.xdark,
  },
  flex: {
    flex: 1,
  },
  header: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  title: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.sm,
    gap: Spacing.sm,
  },
  pressed: {
    opacity: 0.75,
  },
});
