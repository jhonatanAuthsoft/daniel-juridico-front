import { PropsWithChildren, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { CaretLeftIcon } from '@/assets/icon/caret-left';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  return (
    <ThemedView>
      <Pressable
        style={({ pressed }) => [styles.heading, pressed && styles.pressedHeading]}
        onPress={() => setIsOpen((value) => !value)}>
        <ThemedView type="backgroundElement" style={styles.button}>
          <CaretLeftIcon
            color={theme.text}
            direction={isOpen ? 'down' : 'right'}
            height={14}
            width={14}
          />
        </ThemedView>

        <ThemedText type="small">{title}</ThemedText>
      </Pressable>
      {isOpen && (
        <Animated.View entering={FadeIn.duration(200)}>
          <ThemedView type="backgroundElement" style={styles.content}>
            {children}
          </ThemedView>
        </Animated.View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  pressedHeading: {
    opacity: 0.7,
  },
  button: {
    width: Spacing.md,
    height: Spacing.md,
    borderRadius: Radius.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    marginTop: Spacing.sm,
    borderRadius: Radius.medium,
    marginLeft: Spacing.md,
    padding: Spacing.md,
  },
});
