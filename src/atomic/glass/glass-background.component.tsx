import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import {
  angleToPoints,
  BrandGradients,
  type BrandGradientDefinition,
  toGradientLocations,
} from '@/constants/theme';

export type GlassBackgroundProps = {
  /** CSS blur in px (maps to BlurView intensity + web backdrop-filter). */
  blurPx?: number;
  /** Defaults to BrandGradients.gradient */
  gradient?: BrandGradientDefinition;
  style?: StyleProp<ViewStyle>;
};

function GradientLayer({ gradient }: { gradient: BrandGradientDefinition }) {
  const points = angleToPoints(gradient.angleDeg);
  const locations = toGradientLocations(gradient.locationsPercent);

  return (
    <LinearGradient
      colors={[...gradient.colors]}
      locations={locations}
      start={points.start}
      end={points.end}
      style={StyleSheet.absoluteFill}
    />
  );
}

/**
 * Brand glass fill: Gradient-Gradiente + backdrop blur.
 * Looks correct over dark surfaces (as in Figma).
 */
export function GlassBackground({
  blurPx = 12.55,
  gradient = BrandGradients.gradient,
  style,
}: GlassBackgroundProps) {
  const intensity = Math.min(100, Math.round(blurPx * 2));

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
      <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
      <View
        style={[
          StyleSheet.absoluteFill,
          Platform.select({
            web: {
              backdropFilter: `blur(${blurPx}px)`,
              // @ts-expect-error web-only
              WebkitBackdropFilter: `blur(${blurPx}px)`,
            },
            default: {},
          }),
        ]}>
        <GradientLayer gradient={gradient} />
      </View>
    </View>
  );
}

export type CtaGlassBackgroundProps = {
  pressed?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Layered CTA glass: red wash + gray glass + blur. */
export function CtaGlassBackground({ pressed = false, style }: CtaGlassBackgroundProps) {
  const blurPx = pressed ? 12.55 : 36.6;
  const intensity = Math.min(100, Math.round(blurPx * 2));
  const redWash = pressed ? BrandGradients.ctaRedWashPressed : BrandGradients.ctaRedWash;
  const glass = pressed ? BrandGradients.ctaGlassPressed : BrandGradients.ctaGlass;

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
      <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
      <View
        style={[
          StyleSheet.absoluteFill,
          Platform.select({
            web: {
              backdropFilter: `blur(${blurPx}px)`,
              // @ts-expect-error web-only
              WebkitBackdropFilter: `blur(${blurPx}px)`,
            },
            default: {},
          }),
        ]}>
        {/* CSS stacks first-listed on top; paint glass then red wash on top */}
        <GradientLayer gradient={glass} />
        <GradientLayer gradient={redWash} />
        {pressed ? <View style={styles.pressedDim} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pressedDim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.20)',
  },
});
