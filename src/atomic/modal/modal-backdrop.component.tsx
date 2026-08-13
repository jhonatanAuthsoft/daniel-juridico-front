import { type ReactNode } from 'react';
import {
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';

/** Shared dim color for select sheets and informative modals. */
export const MODAL_BACKDROP_COLOR = 'rgba(0, 0, 0, 0.72)';

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
  accessibilityLabel?: string;
  contentStyle?: StyleProp<ViewStyle>;
};

/**
 * Full-screen dim overlay for transparent Modals.
 *
 * Android Dialogs with `transparent` size to wrap_content — `flex:1` /
 * `absoluteFill` alone do NOT expand the window, so the backdrop clips and the
 * sheet floats mid-screen. Explicit window size forces a full-screen Dialog.
 */
export function ModalScrim({
  children,
  onDismiss,
  align = 'bottom',
  accessibilityLabel = 'Fechar',
  contentStyle,
}: ModalScrimProps) {
  const insets = useSafeAreaInsets();
  const { width, height: windowHeight } = useWindowDimensions();
  /** Cover status bar when Modal uses statusBarTranslucent. */
  const height =
    Platform.OS === 'android'
      ? windowHeight + (StatusBar.currentHeight ?? 0)
      : windowHeight;
  const frameStyle = { width, height };

  if (align === 'center') {
    return (
      <View collapsable={false} style={[styles.scrim, frameStyle]}>
        <Pressable
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="button"
          onPress={onDismiss}
          style={StyleSheet.absoluteFill}
        />
        <View
          pointerEvents="box-none"
          style={[styles.centerAnchor, contentStyle]}>
          {children}
        </View>
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
      <View
        style={[
          styles.bottomSheet,
          {
            maxHeight: height * 0.75,
            // Android: lift sheet above nav/gesture area. iOS already sits well via insets.
            paddingBottom:
              Math.max(insets.bottom, Spacing.sm) +
              (Platform.OS === 'android' ? Spacing.lg : 0),
          },
          contentStyle,
        ]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: {
    backgroundColor: MODAL_BACKDROP_COLOR,
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
  centerAnchor: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
});
