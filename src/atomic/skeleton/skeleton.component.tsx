import ContentLoader, { Rect } from 'react-content-loader/native';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import type { NumberProp } from 'react-native-svg';

import { BrandColors, Radius, Spacing } from '@/constants/theme';

type ShimmerRadius = 'small' | 'medium' | 'large';

const RADIUS: Record<ShimmerRadius, number> = {
  small: Radius.small,
  medium: Radius.medium,
  large: Radius.large,
};

/** Base block vs page-matching sweep (`--gradiente-skeleton` inverted for loader). */
const BACKGROUND_COLOR = BrandColors.accessory.darkGray;
const FOREGROUND_COLOR = BrandColors.neutral.xdark;

export type SkeletonProps = {
  width?: NumberProp;
  height?: NumberProp;
  /** Defaults to 12 (`medium`). */
  radius?: ShimmerRadius | number;
  style?: StyleProp<ViewStyle>;
};

function resolveRadius(radius: SkeletonProps['radius']): number {
  if (typeof radius === 'number') {
    return radius;
  }
  if (radius) {
    return RADIUS[radius];
  }
  return Radius.medium;
}

function toNumber(value: NumberProp | undefined, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

/**
 * Atomic shimmer box powered by `react-content-loader/native`.
 */
export function Skeleton({
  width = '100%',
  height = Spacing.sm,
  radius = 'medium',
  style,
}: SkeletonProps) {
  const resolvedRadius = resolveRadius(radius);
  const numericHeight = toNumber(height, Spacing.sm);
  /** Stable SVG coordinate space; scales to the container width. */
  const viewBoxWidth = 400;

  return (
    <View style={[{ width, height: numericHeight }, style]}>
      <ContentLoader
        animate
        backgroundColor={BACKGROUND_COLOR}
        foregroundColor={FOREGROUND_COLOR}
        height={numericHeight}
        speed={1}
        viewBox={`0 0 ${viewBoxWidth} ${numericHeight}`}
        width="100%">
        <Rect
          height={numericHeight}
          rx={resolvedRadius}
          ry={resolvedRadius}
          width={viewBoxWidth}
          x="0"
          y="0"
        />
      </ContentLoader>
    </View>
  );
}

type ShimmerIconProps = {
  width?: number;
  borderRadius?: ShimmerRadius | number;
};

function ShimmerIcon({ width = 40, borderRadius = 'medium' }: ShimmerIconProps) {
  return <Skeleton height={width} radius={borderRadius} width={width} />;
}

type ShimmerButtonProps = {
  width?: NumberProp;
};

function ShimmerButton({ width = '100%' }: ShimmerButtonProps) {
  return <Skeleton height={48} radius="medium" width={width} />;
}

type ShimmerRootProps = {
  children: ReactNode;
};

/** Compound API: `Shimmer.Box` / `Shimmer.Icon` / `Shimmer.Button`. */
export function Shimmer({ children }: ShimmerRootProps) {
  return <>{children}</>;
}

Shimmer.Box = Skeleton;
Shimmer.Icon = ShimmerIcon;
Shimmer.Button = ShimmerButton;

/** @deprecated Prefer {@link Skeleton} props `radius`. */
export type SkeletonLegacyProps = SkeletonProps & {
  borderRadius?: number;
};

const styles = StyleSheet.create({});

void styles;
