import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { XIcon } from '@/assets/icon/x';
import { Body1, Display } from '@/atomic/typography';
import { BrandColors, MaxContentWidth, Spacing } from '@/constants/theme';

type ClientFlowScreenProps = {
  title: string;
  children: ReactNode;
  /** Shows a close (X) action on the right — e.g. "Nova solicitação". */
  onClose?: () => void;
  /** Shows a back chevron on the left with centered title — e.g. details. */
  onBack?: () => void;
  /** When false, children fill the body without scrolling. Default true. */
  scroll?: boolean;
  keyboardAvoiding?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Optional content pinned below the scroll area (e.g. primary CTA). */
  footer?: ReactNode;
};

/**
 * Shared layout for client solicitation flow screens:
 * fixed header + scrollable body.
 */
export function ClientFlowScreen({
  title,
  children,
  onClose,
  onBack,
  scroll = true,
  keyboardAvoiding = false,
  contentContainerStyle,
  footer,
}: ClientFlowScreenProps) {
  const isBackHeader = Boolean(onBack) && !onClose;

  const header = (
    <View style={[styles.header, isBackHeader && styles.headerCentered]}>
      {isBackHeader ? (
        <Pressable
          accessibilityLabel="Voltar"
          accessibilityRole="button"
          hitSlop={Spacing.xxs}
          onPress={onBack}
          style={({ pressed }) => pressed && styles.pressed}>
          <SymbolView
            name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
            size={24}
            tintColor={BrandColors.neutral.white}
          />
        </Pressable>
      ) : null}

      {isBackHeader ? (
        <Body1 color={BrandColors.neutral.white} style={styles.headerTitleCentered}>
          {title}
        </Body1>
      ) : (
        <Display color={BrandColors.neutral.white} style={styles.headerTitle}>
          {title}
        </Display>
      )}

      {onClose ? (
        <Pressable
          accessibilityLabel="Fechar"
          accessibilityRole="button"
          hitSlop={Spacing.xxs}
          onPress={onClose}
          style={({ pressed }) => pressed && styles.pressed}>
          <XIcon color={BrandColors.neutral.white} width={22} height={22} />
        </Pressable>
      ) : isBackHeader ? (
        <View style={styles.headerSpacer} />
      ) : null}
    </View>
  );

  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.content, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={styles.flex}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, styles.flex, contentContainerStyle]}>{children}</View>
  );

  const main = (
    <View style={styles.shell}>
      {header}
      {body}
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}>
          {main}
        </KeyboardAvoidingView>
      ) : (
        main
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BrandColors.neutral.xdark,
  },
  flex: {
    flex: 1,
  },
  shell: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  header: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  headerCentered: {
    justifyContent: 'flex-start',
    gap: Spacing.xs,
  },
  headerTitle: {
    flex: 1,
  },
  headerTitleCentered: {
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  footer: {
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  pressed: {
    opacity: 0.75,
  },
});
