/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const BrandColors = {
  primary: {
    light: '#FFA29D',
    medium: '#C7170E',
    dark: '#881A14',
  },
  accessory: {
    darkBlue: '#494266',
    lightGray: '#666666',
    darkGray: '#424242',
    red: '#EE2E24',
  },
  neutral: {
    white: '#FFFFFF',
    xlight: '#FDFDFD',
    light: '#E6E8E3',
    medium: '#757575',
    dark: '#434242',
    xdark: '#2C2C2C',
    black: '#121418',
  },
  feedback: {
    success: {
      light: '#DCFCE8',
      medium: '#22C55E',
      dark: '#052E14',
    },
    warning: {
      light: '#FEEFC7',
      medium: '#FBBF24',
      dark: '#453303',
    },
    error: {
      light: '#FEE2E2',
      medium: '#FF6767',
      dark: '#450A0A',
    },
  },
} as const;

export type BrandGradientDefinition = {
  colors: readonly [string, string];
  /** CSS angle in degrees (used by LinearGradient via angleToPoints). */
  angleDeg: number;
  /** Color stop locations in CSS percent units (may be < 0 or > 100). */
  locationsPercent: readonly [number, number];
  borderRadius?: number;
};

export const BrandGradients = {
  ctaMedium: {
    colors: [BrandColors.primary.medium, BrandColors.neutral.xdark],
    angleDeg: 95,
    locationsPercent: [-6.62, 54.31],
  },
  borderGlass: {
    colors: [BrandColors.accessory.darkBlue, BrandColors.accessory.lightGray],
    angleDeg: 206,
    locationsPercent: [-2.49, 83.45],
    borderRadius: 100,
  },
  gradient: {
    colors: ['rgba(66, 66, 66, 0.30)', 'rgba(96, 120, 128, 0.30)'],
    angleDeg: 182,
    locationsPercent: [3.52, 98.66],
    borderRadius: 100,
  },
  /** CTA base — gray glass layer (0.50 alpha). */
  ctaGlass: {
    colors: ['rgba(66, 66, 66, 0.50)', 'rgba(96, 120, 128, 0.50)'],
    angleDeg: 182,
    locationsPercent: [3.52, 98.66],
  },
  /**
   * CTA base — red wash. CSS end stop is 230.82%; visible end color
   * is pre-interpolated for the 0–100% range.
   */
  ctaRedWash: {
    colors: ['rgba(199, 23, 14, 0)', 'rgba(199, 23, 14, 0.214)'],
    angleDeg: 87,
    locationsPercent: [2.15, 100],
  },
  /** CTA pressed — gray glass layer (0.13 alpha). */
  ctaGlassPressed: {
    colors: ['rgba(66, 66, 66, 0.13)', 'rgba(96, 120, 128, 0.13)'],
    angleDeg: 182,
    locationsPercent: [3.52, 98.66],
  },
  /** CTA pressed — red wash (end stop 230.82% → ~0.43 opacity at 100%). */
  ctaRedWashPressed: {
    colors: ['rgba(199, 23, 14, 0)', 'rgba(199, 23, 14, 0.428)'],
    angleDeg: 87,
    locationsPercent: [2.15, 100],
  },
} as const satisfies Record<string, BrandGradientDefinition>;

export const CtaButtonTokens = {
  border: BrandColors.primary.dark,
  blurBasePx: 36.6,
  blurPressedPx: 12.55,
  shadow: {
    color: 'rgba(44, 44, 44, 0.50)',
    radius: 21.4,
  },
} as const;

/** Converts a CSS gradient angle to LinearGradient start/end points. */
export function angleToPoints(angleDeg: number) {
  const radians = ((90 - angleDeg) * Math.PI) / 180;
  return {
    start: { x: 0.5 - Math.sin(radians) / 2, y: 0.5 - Math.cos(radians) / 2 },
    end: { x: 0.5 + Math.sin(radians) / 2, y: 0.5 + Math.cos(radians) / 2 },
  };
}

/** Clamps CSS percent stops into the 0–1 range expected by LinearGradient. */
export function toGradientLocations(locationsPercent: readonly [number, number]) {
  return locationsPercent.map((percent) =>
    Math.min(1, Math.max(0, percent / 100)),
  ) as [number, number];
}

/** Inter font family names by weight (offline via @expo-google-fonts/inter). */
export const InterFontFamily = {
  400: 'Inter_400Regular',
  500: 'Inter_500Medium',
  600: 'Inter_600SemiBold',
  700: 'Inter_700Bold',
  800: 'Inter_800ExtraBold',
} as const;

export type InterFontWeight = keyof typeof InterFontFamily;

export const FontSize = {
  xxxSmall: 12,
  xxSmall: 14,
  xSmall: 16,
  small: 18,
  medium: 20,
  large: 24,
  xLarge: 32,
  xxLarge: 48,
} as const;

export const FontLineHeight = {
  small: 1,
  medium: 1.3,
  large: 1.5,
} as const;

export const FontWeight = {
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
} as const;

export function resolveLineHeight(fontSize: number, lineHeight: number) {
  return Math.round(fontSize * lineHeight);
}

export const Fonts = Platform.select({
  ios: {
    sans: InterFontFamily[400],
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: InterFontFamily[400],
    serif: 'serif',
    rounded: InterFontFamily[400],
    mono: 'monospace',
  },
  web: {
    sans: InterFontFamily[400],
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Radius = {
  small: 8,
  medium: 12,
  large: 24,
} as const;

export const Spacing = {
  xxxs: 4,
  xxs: 8,
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
  xxl: 64,
  xxxl: 96,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
