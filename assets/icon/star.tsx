import Svg, { Path, type SvgProps } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';

import { BrandColors } from '@/constants/theme';

export const STAR_YELLOW = BrandColors.feedback.warning.medium;

export type StarFill = 'empty' | 'half' | 'full';

type StarIconProps = SvgProps & {
  color?: string;
  size?: number;
  filled?: boolean;
  fill?: StarFill;
};

export function resolveStarFill(star: number, rating: number): StarFill {
  if (rating >= star) {
    return 'full';
  }
  if (rating >= star - 0.5) {
    return 'half';
  }
  return 'empty';
}

export function StarIcon({
  color = STAR_YELLOW,
  size = 24,
  filled = true,
  fill,
  width,
  height,
  ...props
}: StarIconProps) {
  const resolvedWidth = width ?? size;
  const resolvedHeight = height ?? size;
  const resolvedFill: StarFill = fill ?? (filled ? 'full' : 'empty');

  if (resolvedFill === 'full') {
    return (
      <Svg
        width={resolvedWidth}
        height={resolvedHeight}
        viewBox="0 0 24 24"
        fill="none"
        {...props}>
        <Path
          d="M12 2.5L14.89 8.76L21.8 9.53L16.7 14.14L18.16 21L12 17.5L5.84 21L7.3 14.14L2.2 9.53L9.11 8.76L12 2.5Z"
          fill={color}
        />
      </Svg>
    );
  }

  return (
    <Svg
      width={resolvedWidth}
      height={resolvedHeight}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path
        d="M12 4.86L13.96 9.11L14.18 9.58L14.7 9.64L19.38 10.16L16.04 13.22L15.66 13.57L15.77 14.08L16.76 18.72L12.45 16.25L12 16L11.55 16.25L7.24 18.72L8.23 14.08L8.34 13.57L7.96 13.22L4.62 10.16L9.3 9.64L9.82 9.58L10.04 9.11L12 4.86ZM12 2.5L9.11 8.76L2.2 9.53L7.3 14.14L5.84 21L12 17.5L18.16 21L16.7 14.14L21.8 9.53L14.89 8.76L12 2.5Z"
        fill={color}
      />
    </Svg>
  );
}

type StarRatingProps = {
  rating: number;
  size?: number;
  color?: string;
  accessibilityLabel?: string;
};

export function StarRating({
  rating,
  size = 16,
  color = STAR_YELLOW,
  accessibilityLabel,
}: StarRatingProps) {
  return (
    <View accessibilityLabel={accessibilityLabel} style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarSlot
          key={star}
          color={color}
          fill={resolveStarFill(star, rating)}
          size={size}
        />
      ))}
    </View>
  );
}

function StarSlot({
  fill,
  size,
  color,
}: {
  fill: StarFill;
  size: number;
  color: string;
}) {
  return (
    <View style={{ width: size, height: size }}>
      <StarIcon color={color} filled={false} size={size} />
      {fill !== 'empty' ? (
        <View
          style={[
            styles.fillMask,
            { height: size, width: fill === 'half' ? size / 2 : size },
          ]}>
          <StarIcon color={color} filled size={size} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fillMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
});
