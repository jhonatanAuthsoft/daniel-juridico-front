import { Pressable, StyleSheet, View } from 'react-native';

import { CheckIcon } from '@/assets/icon/check';
import { ChevronRightIcon } from '@/assets/icon/chevron-right';
import { XIcon } from '@/assets/icon/x';
import { Body1, Body2, Heading2 } from '@/atomic/typography';
import { SOLICITATION_STATUS_META } from '@/components/client-solicitation-card';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

import type { LawyerHistoryItem } from './mock-lawyer-history';

export type LawyerHistoryCardProps = LawyerHistoryItem & {
  onPress?: () => void;
};

const DECISION_META = {
  accepted: {
    label: 'Solicitação aceita.',
    color: BrandColors.feedback.success.medium,
    Icon: CheckIcon,
  },
  rejected: {
    label: 'Solicitação recusada',
    color: BrandColors.primary.light,
    Icon: XIcon,
  },
} as const;

export function LawyerHistoryCard({
  clientName,
  urgency,
  description,
  decision,
  onPress,
}: LawyerHistoryCardProps) {
  const urgencyMeta = SOLICITATION_STATUS_META[urgency];
  const decisionMeta = DECISION_META[decision];
  const DecisionIcon = decisionMeta.Icon;

  return (
    <Pressable
      accessibilityRole="button"
      testID="history-card"
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && onPress ? styles.cardPressed : null]}>
      <View style={styles.topRow}>
        <View style={styles.nameStatus}>
          <Heading2 color={BrandColors.neutral.white} numberOfLines={1} style={styles.name}>
            {clientName}
          </Heading2>
          <View style={styles.urgencyRow}>
            <View
              style={[styles.urgencyDot, { backgroundColor: urgencyMeta.accentColor }]}
            />
            <Body2 color={urgencyMeta.labelColor} numberOfLines={1}>
              {urgencyMeta.label}
            </Body2>
          </View>
        </View>
        <ChevronRightIcon color={BrandColors.neutral.white} width={20} height={20} />
      </View>

      <Body1 color={BrandColors.neutral.light} numberOfLines={2}>
        {description}
      </Body1>

      <View style={styles.decisionRow}>
        <DecisionIcon color={decisionMeta.color} width={16} height={16} />
        <Body2 color={decisionMeta.color}>{decisionMeta.label}</Body2>
      </View>
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  nameStatus: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.xxs,
  },
  name: {
    flexShrink: 1,
  },
  urgencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxxs,
  },
  urgencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  decisionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxxs,
  },
});
