import { Pressable, StyleSheet } from 'react-native';

import { CaretLeftIcon } from '@/assets/icon/caret-left';
import { Link as TypographLink } from '@/atomic/typography';
import { BrandColors, Spacing } from '@/constants/theme';

export type BackLinkProps = {
  onPress: () => void;
  children?: string;
};

export function BackLink({ onPress, children = 'Voltar' }: BackLinkProps) {
  return (
    <Pressable accessibilityRole="link" onPress={onPress} style={styles.backLink}>
      <CaretLeftIcon color={BrandColors.primary.light} height={16} width={16} />
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
