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

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
