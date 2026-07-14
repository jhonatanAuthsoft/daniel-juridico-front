import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Body1,
  Body2,
  Display,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  InputCaption,
  InputLabel,
  InputValue,
  Link,
  LinkSmall,
} from '@/atomic/typography';
import { ThemedView } from '@/components/themed-view';
import {
  angleToPoints,
  BottomTabInset,
  BrandColors,
  BrandGradients,
  type BrandGradientDefinition,
  MaxContentWidth,
  Radius,
  Spacing,
  toGradientLocations,
} from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const SWATCH_SIZE = 50;

type StyleGuideRowProps = {
  label: string;
  children: ReactNode;
};

function StyleGuideRow({ label, children }: StyleGuideRowProps) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <Body2 color={theme.textSecondary}>{label}</Body2>
      {children}
    </View>
  );
}

type ColorSwatchProps = {
  label: string;
  color: string;
};

function ColorSwatch({ label, color }: ColorSwatchProps) {
  return (
    <View style={styles.swatchItem}>
      <View
        style={[
          styles.swatch,
          {
            backgroundColor: color,
            borderColor: BrandColors.neutral.light,
          },
        ]}
      />
      <Body2>{label}</Body2>
      <InputCaption color={BrandColors.neutral.medium}>{color}</InputCaption>
    </View>
  );
}

type GradientSwatchProps = {
  label: string;
  gradient: BrandGradientDefinition;
};

function GradientSwatch({ label, gradient }: GradientSwatchProps) {
  const points = angleToPoints(gradient.angleDeg);

  return (
    <View style={styles.swatchItem}>
      <LinearGradient
        colors={[...gradient.colors]}
        locations={toGradientLocations(gradient.locationsPercent)}
        start={points.start}
        end={points.end}
        style={[
          styles.swatch,
          {
            borderRadius: gradient.borderRadius ? Math.min(gradient.borderRadius, SWATCH_SIZE / 2) : 0,
            borderColor: BrandColors.neutral.light,
          },
        ]}
      />
      <Body2>{label}</Body2>
    </View>
  );
}

type ColorGroupProps = {
  title: string;
  swatches: ColorSwatchProps[];
};

function ColorGroup({ title, swatches }: ColorGroupProps) {
  return (
    <View style={styles.colorGroup}>
      <Heading2>{title}</Heading2>
      <View style={styles.swatchGrid}>
        {swatches.map((swatch) => (
          <ColorSwatch key={swatch.label} {...swatch} />
        ))}
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Display>Style Guide</Display>

          <Body1 color={theme.textSecondary}>Colors</Body1>

          <ColorGroup
            title="Primary"
            swatches={[
              { label: 'light', color: BrandColors.primary.light },
              { label: 'medium', color: BrandColors.primary.medium },
              { label: 'dark', color: BrandColors.primary.dark },
            ]}
          />

          <View style={styles.colorGroup}>
            <Heading2>CTA</Heading2>
            <View style={styles.swatchGrid}>
              <GradientSwatch label="ctaMedium" gradient={BrandGradients.ctaMedium} />
            </View>
          </View>

          <ColorGroup
            title="Accessory"
            swatches={[
              { label: 'darkBlue', color: BrandColors.accessory.darkBlue },
              { label: 'lightGray', color: BrandColors.accessory.lightGray },
              { label: 'darkGray', color: BrandColors.accessory.darkGray },
              { label: 'red', color: BrandColors.accessory.red },
            ]}
          />

          <View style={styles.colorGroup}>
            <Heading2>Gradient</Heading2>
            <View style={styles.swatchGrid}>
              <GradientSwatch label="borderGlass" gradient={BrandGradients.borderGlass} />
              <GradientSwatch label="gradient" gradient={BrandGradients.gradient} />
            </View>
          </View>

          <ColorGroup
            title="Neutral"
            swatches={[
              { label: 'white', color: BrandColors.neutral.white },
              { label: 'xlight', color: BrandColors.neutral.xlight },
              { label: 'light', color: BrandColors.neutral.light },
              { label: 'medium', color: BrandColors.neutral.medium },
              { label: 'dark', color: BrandColors.neutral.dark },
              { label: 'xdark', color: BrandColors.neutral.xdark },
              { label: 'black', color: BrandColors.neutral.black },
            ]}
          />

          <ColorGroup
            title="Feedback · Success"
            swatches={[
              { label: 'light', color: BrandColors.feedback.success.light },
              { label: 'medium', color: BrandColors.feedback.success.medium },
              { label: 'dark', color: BrandColors.feedback.success.dark },
            ]}
          />

          <ColorGroup
            title="Feedback · Warning"
            swatches={[
              { label: 'light', color: BrandColors.feedback.warning.light },
              { label: 'medium', color: BrandColors.feedback.warning.medium },
              { label: 'dark', color: BrandColors.feedback.warning.dark },
            ]}
          />

          <ColorGroup
            title="Feedback · Error"
            swatches={[
              { label: 'light', color: BrandColors.feedback.error.light },
              { label: 'medium', color: BrandColors.feedback.error.medium },
              { label: 'dark', color: BrandColors.feedback.error.dark },
            ]}
          />

          <Body1 color={theme.textSecondary}>Radius</Body1>
          <View style={styles.swatchGrid}>
            {(
              [
                ['small', Radius.small],
                ['medium', Radius.medium],
                ['large', Radius.large],
              ] as const
            ).map(([label, value]) => (
              <View key={label} style={styles.swatchItem}>
                <View
                  style={[
                    styles.radiusSwatch,
                    {
                      borderRadius: value,
                      borderColor: BrandColors.primary.medium,
                      backgroundColor: BrandColors.primary.light,
                    },
                  ]}
                />
                <Body2>{label}</Body2>
                <InputCaption color={BrandColors.neutral.medium}>{value}px</InputCaption>
              </View>
            ))}
          </View>

          <Body1 color={theme.textSecondary}>Spacing</Body1>
          <View style={styles.spacingList}>
            {(
              [
                ['xxxs', Spacing.xxxs],
                ['xxs', Spacing.xxs],
                ['xs', Spacing.xs],
                ['sm', Spacing.sm],
                ['md', Spacing.md],
                ['lg', Spacing.lg],
                ['xl', Spacing.xl],
                ['xxl', Spacing.xxl],
                ['xxxl', Spacing.xxxl],
              ] as const
            ).map(([label, value]) => (
              <View key={label} style={styles.spacingRow}>
                <View style={styles.spacingMeta}>
                  <Body2>{label}</Body2>
                  <InputCaption color={BrandColors.neutral.medium}>{value}px</InputCaption>
                </View>
                <View
                  style={[
                    styles.spacingBar,
                    {
                      width: value,
                      backgroundColor: BrandColors.primary.medium,
                    },
                  ]}
                />
              </View>
            ))}
          </View>

          <Body1 color={theme.textSecondary}>Typography</Body1>

          <StyleGuideRow label="Display · 700 · Large · 130%">
            <Display>Display</Display>
          </StyleGuideRow>

          <StyleGuideRow label="Heading 1 · 600 · Medium · 130%">
            <Heading1>Heading 1</Heading1>
          </StyleGuideRow>

          <StyleGuideRow label="Heading 2 · 700 · Small · 130%">
            <Heading2>Heading 2</Heading2>
          </StyleGuideRow>

          <StyleGuideRow label="Heading 3 · 500 · X-Small · 130%">
            <Heading3>Heading 3</Heading3>
          </StyleGuideRow>

          <StyleGuideRow label="Heading 4 · 700 · XX-Small · 130%">
            <Heading4>Heading 4</Heading4>
          </StyleGuideRow>

          <StyleGuideRow label="Body 1 · 500 · Small · 150%">
            <Body1>Body 1</Body1>
          </StyleGuideRow>

          <StyleGuideRow label="Body 1 Bold · 700 · Small · 150%">
            <Body1 bold>Body 1 Bold</Body1>
          </StyleGuideRow>

          <StyleGuideRow label="Body 2 · 500 · X-Small · 150%">
            <Body2>Body 2</Body2>
          </StyleGuideRow>

          <StyleGuideRow label="Body 2 Bold · 700 · X-Small · 150%">
            <Body2 bold>Body 2 Bold</Body2>
          </StyleGuideRow>

          <StyleGuideRow label="Link · 500 · X-Small · 150%">
            <Link>Link</Link>
          </StyleGuideRow>

          <StyleGuideRow label="Link Small · 500 · XX-Small · 150%">
            <LinkSmall>Link Small</LinkSmall>
          </StyleGuideRow>

          <StyleGuideRow label="Input Label · 500 · X-Small · 130%">
            <InputLabel>Input Label</InputLabel>
          </StyleGuideRow>

          <StyleGuideRow label="Input Value · 500 · X-Small · 130%">
            <InputValue>Input Value</InputValue>
          </StyleGuideRow>

          <StyleGuideRow label="Input Caption · 500 · XXX-Small · 130%">
            <InputCaption>Input Caption</InputCaption>
          </StyleGuideRow>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    width: '100%',
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: BottomTabInset + Spacing.lg,
    gap: Spacing.md,
  },
  row: {
    gap: Spacing.xxxs,
  },
  colorGroup: {
    gap: Spacing.xxs,
  },
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  swatchItem: {
    width: 88,
    gap: Spacing.xxxs,
  },
  swatch: {
    width: SWATCH_SIZE,
    height: SWATCH_SIZE,
    borderWidth: 1,
  },
  radiusSwatch: {
    width: SWATCH_SIZE,
    height: SWATCH_SIZE,
    borderWidth: 2,
  },
  spacingList: {
    gap: Spacing.sm,
  },
  spacingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  spacingMeta: {
    width: 72,
    gap: Spacing.xxxs,
  },
  spacingBar: {
    height: Spacing.xxs,
    borderRadius: Radius.small,
  },
});
