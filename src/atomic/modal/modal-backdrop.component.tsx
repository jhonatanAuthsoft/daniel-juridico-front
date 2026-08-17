import { type ReactNode, useContext } from 'react';
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  useReanimatedKeyboardAnimation,
} from 'react-native-keyboard-controller';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';

/** Shared dim color for select sheets and informative modals. */
export const MODAL_BACKDROP_COLOR = 'rgba(0, 0, 0, 0.72)';

const ZERO_INSETS = { top: 0, right: 0, bottom: 0, left: 0 };

export type ModalBackdropProps = {
  onPress?: () => void;
  accessibilityLabel?: string;
};

/**
 * @deprecated Prefer {@link ModalScrim} — kept for call sites that only need a hit target.
 */
export function ModalBackdrop({
  onPress,
  accessibilityLabel = 'Fechar',
}: ModalBackdropProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={StyleSheet.absoluteFill}
    />
  );
}

export type ModalScrimProps = {
  children: ReactNode;
  onDismiss?: () => void;
  /** `bottom` = sheet; `center` = dialog. */
  align?: 'bottom' | 'center';
  /**
   * How the sheet reacts to the IME.
   * `compress` (default) sits the sheet above the keyboard and uses the
   * remaining viewport as max height so search results stay visible.
   * `lift` keeps the sheet height and translates it up (focused field at the
   * bottom, e.g. review comment).
   */
  keyboardBehavior?: 'compress' | 'lift';
  /**
   * Stretch the sheet to the available max height (`height: cap` instead of
   * hugging content). Pending design review — see
   * `docs/plans/2026-08-16-keyboard-inputs-manual-test.md`.
   */
  fillAvailable?: boolean;
  accessibilityLabel?: string;
  contentStyle?: StyleProp<ViewStyle>;
};

/**
 * Full-screen dim overlay for transparent Modals.
 *
 * Android Dialogs with `transparent` size to wrap_content — `flex:1` /
 * `absoluteFill` alone do NOT expand the window, so the backdrop clips and the
 * sheet floats mid-screen. Explicit window size forces a full-screen Dialog.
 *
 * Keyboard: sheet/dialog lift via `useReanimatedKeyboardAnimation` so search
 * fields and content stay above the IME on both platforms (edge-to-edge Android).
 */
export function ModalScrim({
  children,
  onDismiss,
  align = 'bottom',
  keyboardBehavior = 'compress',
  fillAvailable = false,
  accessibilityLabel = 'Fechar',
  contentStyle,
}: ModalScrimProps) {
  /** Context avoids throwing in Jest when `<SafeAreaProvider>` is absent. */
  const insets = useContext(SafeAreaInsetsContext) ?? ZERO_INSETS;
  const { width, height: windowHeight } = useWindowDimensions();
  const { height: keyboardHeight } = useReanimatedKeyboardAnimation();
  const screenHeight = Dimensions.get('screen').height;
  /** Cover status bar when Modal uses statusBarTranslucent. Prefer screen
   * height so Android `adjustResize` does not shrink the overlay with the IME. */
  const height = Platform.OS === 'android' ? screenHeight : windowHeight;
  const frameStyle = { width, height };
  const baseBottomPad =
    Math.max(insets.bottom, Spacing.sm) +
    (Platform.OS === 'android' ? Spacing.lg : 0);
  const topSafe = (insets.top > 0 ? insets.top : Spacing.lg) + Spacing.sm;

  const bottomSheetAnimatedStyle = useAnimatedStyle(() => {
    const kb = Math.abs(keyboardHeight.value);
    const remaining = Math.max(height - kb - topSafe, 0);
    const cap =
      keyboardBehavior === 'lift'
        ? height * 0.92
        : Math.min(height * 0.92, remaining);

    if (fillAvailable) {
      return {
        paddingBottom: baseBottomPad,
        maxHeight: cap,
        height: cap,
        transform: [{ translateY: -kb }],
      };
    }

    return {
      paddingBottom: baseBottomPad,
      maxHeight: cap,
      transform: [{ translateY: -kb }],
    };
  });

  const centerDialogAnimatedStyle = useAnimatedStyle(() => {
    const kb = Math.abs(keyboardHeight.value);
    return {
      transform: [{ translateY: kb > 0 ? -kb / 2 : 0 }],
      maxHeight: Math.max(height - kb - Spacing.lg * 2, height * 0.4),
    };
  });

  if (align === 'center') {
    return (
      <View collapsable={false} style={[styles.scrimCenter, frameStyle]}>
        <Pressable
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="button"
          onPress={onDismiss}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View
          style={[styles.centerDialog, centerDialogAnimatedStyle, contentStyle]}>
          {children}
        </Animated.View>
      </View>
    );
  }

  return (
    <View collapsable={false} style={[styles.scrimColumn, frameStyle]}>
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        onPress={onDismiss}
        style={styles.flexFill}
      />
      <Animated.View
        style={[styles.bottomSheet, bottomSheetAnimatedStyle, contentStyle]}>
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrimCenter: {
    backgroundColor: MODAL_BACKDROP_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrimColumn: {
    backgroundColor: MODAL_BACKDROP_COLOR,
    justifyContent: 'flex-end',
  },
  flexFill: {
    flex: 1,
  },
  bottomSheet: {
    width: '100%',
    paddingHorizontal: Spacing.sm,
  },
  centerDialog: {
    width: '100%',
    paddingHorizontal: Spacing.sm,
  },
});
