import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CalendarIcon } from '@/assets/icon/calendar';
import { Body1, Body2, Heading1 } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

import {
  formatSolicitationFooter,
  SOLICITATION_STATUS_META,
  type ClientSolicitationCardData,
} from './client-solicitation-card.types';

export type ClientSolicitationCardProps = ClientSolicitationCardData & {
  onPress?: () => void;
};

export function ClientSolicitationCard({
  status,
  title,
  description,
  date,
  lawyerCount,
  footerVariant,
  onPress,
}: ClientSolicitationCardProps) {
  const statusMeta = SOLICITATION_STATUS_META[status];
  const footer = formatSolicitationFooter(lawyerCount, footerVariant);

  return (
    <Pressable
      accessibilityRole="button"
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && onPress ? styles.cardPressed : null]}>
      <View style={styles.statusRow}>
        <View style={[styles.statusDot, { backgroundColor: statusMeta.accentColor }]} />
        <Body2 color={statusMeta.labelColor}>{statusMeta.label}</Body2>
      </View>

      <Heading1 color={BrandColors.neutral.white}>{title}</Heading1>

      <Body1 color={BrandColors.neutral.white} numberOfLines={1}>
        {description}
      </Body1>

      <View style={styles.dateRow}>
        <CalendarIcon color={BrandColors.neutral.white} width={16} height={16} />
        <Body2 color={BrandColors.neutral.white}>{date}</Body2>
      </View>

      <Body1 color={BrandColors.neutral.white}>
        <Text style={{ color: statusMeta.accentColor }}>{footer.countLabel}</Text>
        {footer.rest}
      </Body1>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    gap: Spacing.xs,
    padding: Spacing.sm,
    borderRadius: Radius.large,
    backgroundColor: BrandColors.accessory.darkGray,
  },
  cardPressed: {
    opacity: 0.88,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
});
