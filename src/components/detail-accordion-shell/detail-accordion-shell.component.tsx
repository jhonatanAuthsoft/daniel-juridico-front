import { useState, type PropsWithChildren } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { CaretLeftIcon } from '@/assets/icon/caret-left';
import { Heading1 } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

const ANIMATION_DURATION_MS = 260;
const ANIMATION_EASING = Easing.bezier(0.25, 0.1, 0.25, 1);
const TIMING = {
  duration: ANIMATION_DURATION_MS,
  easing: ANIMATION_EASING,
} as const;

export type DetailAccordionShellProps = PropsWithChildren<{
  title: string;
  initiallyOpen?: boolean;
  /** Divider between header and body (client detail style). */
  showDivider?: boolean;
}>;

/**
 * Shared collapsible panel with Reanimated height + caret rotation.
 *
 * Content height is measured via an invisible twin so closed panels
 * (`height: 0`) still know the target size before opening.
 */
export function DetailAccordionShell({
  title,
  initiallyOpen = false,
  showDivider = false,
  children,
}: DetailAccordionShellProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const progress = useSharedValue(initiallyOpen ? 1 : 0);
  const height = useSharedValue(0);
  const measuredHeight = useSharedValue(0);

  const toggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    progress.value = withTiming(next ? 1 : 0, TIMING);
    height.value = withTiming(next ? measuredHeight.value : 0, TIMING);
  };

  const bodyStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: interpolate(progress.value, [0, 0.2, 1], [0, 0.7, 1]),
    overflow: 'hidden' as const,
  }));

  const caretStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(progress.value, [0, 1], [0, 180])}deg`,
      },
    ],
  }));

  const body = (
    <>
      {showDivider ? <View style={styles.divider} /> : null}
      <View style={styles.content}>{children}</View>
    </>
  );

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel={title}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        onPress={toggle}
        style={({ pressed }) => [
          styles.header,
          isOpen && styles.headerOpen,
          pressed && styles.pressed,
        ]}>
        <Heading1 color={BrandColors.neutral.white} style={styles.title}>
          {title}
        </Heading1>
        <Animated.View style={caretStyle}>
          <CaretLeftIcon
            color={BrandColors.neutral.white}
            direction="down"
            height={22}
            width={22}
          />
        </Animated.View>
      </Pressable>

      <View
        style={[styles.bodySlot, isOpen ? styles.bodySlotOpen : null]}>
        <View
          pointerEvents="none"
          style={styles.measure}
          onLayout={(event) => {
            const nextHeight = event.nativeEvent.layout.height;
            if (nextHeight <= 0) {
              return;
            }
            const previous = measuredHeight.value;
            measuredHeight.value = nextHeight;
            if (isOpen && (previous <= 0 || Math.abs(previous - nextHeight) > 1)) {
              height.value = nextHeight;
            }
          }}>
          {body}
        </View>

        <Animated.View
          accessibilityElementsHidden={!isOpen}
          importantForAccessibility={isOpen ? 'yes' : 'no-hide-descendants'}
          pointerEvents={isOpen ? 'auto' : 'none'}
          style={bodyStyle}>
          {body}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: Radius.large,
    backgroundColor: BrandColors.accessory.darkGray,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    padding: Spacing.sm,
  },
  headerOpen: {
    paddingBottom: 0,
  },
  title: {
    flex: 1,
  },
  bodySlot: {
    position: 'relative',
    paddingHorizontal: Spacing.sm,
  },
  bodySlotOpen: {
    paddingBottom: Spacing.sm,
  },
  measure: {
    position: 'absolute',
    left: 0,
    right: 0,
    opacity: 0,
    zIndex: -1,
  },
  divider: {
    height: 1,
    marginTop: Spacing.sm,
    backgroundColor: BrandColors.neutral.medium,
  },
  content: {
    marginTop: Spacing.sm,
  },
  pressed: {
    opacity: 0.75,
  },
});
