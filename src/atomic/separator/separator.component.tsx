import { View, type ViewProps, type ViewStyle } from 'react-native';

import { Spacing } from '@/constants/theme';

export type SeparatorSize = keyof typeof Spacing;

export type SeparatorProps = ViewProps & {
  size?: SeparatorSize;
  /** When true, renders horizontal space (width) instead of vertical (height). */
  horizontal?: boolean;
};

/**
 * Applies Spacing tokens as empty space between elements.
 *
 * @example
 * <Separator size="xxs" /> // 8px vertical
 * <Separator size="sm" horizontal /> // 16px horizontal
 */
export function Separator({ size = 'xxs', horizontal = false, style, ...rest }: SeparatorProps) {
  const space = Spacing[size];
  const spacingStyle: ViewStyle = horizontal ? { width: space } : { height: space };

  return <View style={[spacingStyle, style]} {...rest} />;
}
