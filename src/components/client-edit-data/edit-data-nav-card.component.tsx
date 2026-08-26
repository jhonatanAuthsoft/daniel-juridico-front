import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { EditAltIcon } from '@/assets/icon/edit-alt';
import { Body1, Body2 } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

type EditDataNavCardProps = {
  title: string;
  subtitle: string;
  accessibilityLabel: string;
  onPress?: () => void;
  badge?: string;
  titleBold?: boolean;
  subtitleNumberOfLines?: number;
};

function CardBody({
  title,
  subtitle,
  badge,
  titleBold,
  subtitleNumberOfLines,
}: Pick<
  EditDataNavCardProps,
  'title' | 'subtitle' | 'badge' | 'titleBold' | 'subtitleNumberOfLines'
>): ReactNode {
  return (
    <>
      <View style={styles.copy}>
        <Body1 bold={titleBold} color={BrandColors.neutral.white}>
          {title}
        </Body1>
        {subtitle ? (
          <Body2
            color={BrandColors.neutral.light}
            numberOfLines={subtitleNumberOfLines}>
            {subtitle}
          </Body2>
        ) : null}
        {badge ? (
          <View style={styles.badge}>
            <Body2 color={BrandColors.neutral.white}>{badge}</Body2>
          </View>
        ) : null}
      </View>
      <EditAltIcon
        accessibilityElementsHidden
        importantForAccessibility="no"
        color={BrandColors.neutral.xlight}
        size={20}
      />
    </>
  );
}

export function EditDataNavCard({
  title,
  subtitle,
  accessibilityLabel,
  onPress,
  badge,
  titleBold,
  subtitleNumberOfLines,
}: EditDataNavCardProps) {
  if (!onPress) {
    return (
      <View accessibilityLabel={accessibilityLabel} style={styles.card}>
        <CardBody
          badge={badge}
          subtitle={subtitle}
          subtitleNumberOfLines={subtitleNumberOfLines}
          title={title}
          titleBold={titleBold}
        />
      </View>
    );
  }

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <CardBody
        badge={badge}
        subtitle={subtitle}
        subtitleNumberOfLines={subtitleNumberOfLines}
        title={title}
        titleBold={titleBold}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.large,
    backgroundColor: BrandColors.accessory.darkGray,
  },
  copy: {
    flex: 1,
    gap: Spacing.xxxs,
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: Spacing.xxxs,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xxxs,
    borderRadius: Radius.large,
    backgroundColor: BrandColors.neutral.xdark,
  },
  pressed: {
    opacity: 0.75,
  },
});
