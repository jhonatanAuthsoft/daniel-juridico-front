import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

import { Link as TypographLink } from '@/atomic/typography';
import { BrandColors, Spacing } from '@/constants/theme';

export type BackLinkProps = {
  onPress: () => void;
  children?: string;
};

function ChevronLeftIcon() {
  return (
    <SymbolView
      name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
      size={16}
      tintColor={BrandColors.primary.light}
    />
  );
}

export function BackLink({ onPress, children = 'Voltar' }: BackLinkProps) {
  return (
    <Pressable accessibilityRole="link" onPress={onPress} style={styles.backLink}>
      <ChevronLeftIcon />
      <TypographLink color={BrandColors.primary.light}>{children}</TypographLink>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backLink: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxxs,
  },
});
