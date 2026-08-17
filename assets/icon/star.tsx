import Svg, { Path, type SvgProps } from 'react-native-svg';

import { BrandColors } from '@/constants/theme';

type StarIconProps = SvgProps & {
  color?: string;
  size?: number;
  filled?: boolean;
};

export function StarIcon({
  color = BrandColors.feedback.warning.medium,
  size = 24,
  filled = true,
  width,
  height,
  ...props
}: StarIconProps) {
  const resolvedWidth = width ?? size;
  const resolvedHeight = height ?? size;

  return (
    <Svg
      width={resolvedWidth}
      height={resolvedHeight}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      {filled ? (
        <Path
          d="M12 2.5L14.89 8.76L21.8 9.53L16.7 14.14L18.16 21L12 17.5L5.84 21L7.3 14.14L2.2 9.53L9.11 8.76L12 2.5Z"
          fill={color}
        />
      ) : (
        <Path
          d="M12 4.86L13.96 9.11L14.18 9.58L14.7 9.64L19.38 10.16L16.04 13.22L15.66 13.57L15.77 14.08L16.76 18.72L12.45 16.25L12 16L11.55 16.25L7.24 18.72L8.23 14.08L8.34 13.57L7.96 13.22L4.62 10.16L9.3 9.64L9.82 9.58L10.04 9.11L12 4.86ZM12 2.5L9.11 8.76L2.2 9.53L7.3 14.14L5.84 21L12 17.5L18.16 21L16.7 14.14L21.8 9.53L14.89 8.76L12 2.5Z"
          fill={color}
        />
      )}
    </Svg>
  );
}
