import { SymbolView } from 'expo-symbols';
import { useState, type PropsWithChildren } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Heading1 } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

type LawyerDetailAccordionShellProps = PropsWithChildren<{
  title: string;
  initiallyOpen?: boolean;
}>;

export function LawyerDetailAccordionShell({
  title,
  initiallyOpen = false,
  children,
}: LawyerDetailAccordionShellProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel={title}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        onPress={() => setIsOpen((current) => !current)}
        style={({ pressed }) => [styles.header, pressed && styles.pressed]}>
        <Heading1 color={BrandColors.neutral.white} style={styles.title}>
          {title}
        </Heading1>
        <SymbolView
          name={{
            ios: isOpen ? 'chevron.up' : 'chevron.down',
            android: isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down',
            web: isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down',
          }}
          size={22}
          tintColor={BrandColors.neutral.white}
        />
      </Pressable>
      {isOpen ? <View style={styles.content}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: Spacing.sm,
    borderRadius: Radius.large,
    backgroundColor: BrandColors.accessory.darkGray,
  },
  header: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  title: {
    flex: 1,
  },
  content: {
    marginTop: Spacing.sm,
  },
  pressed: {
    opacity: 0.75,
  },
});
