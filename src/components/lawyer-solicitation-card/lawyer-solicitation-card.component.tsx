import { Pressable, StyleSheet, View } from 'react-native';

import { CalendarIcon } from '@/assets/icon/calendar';
import { CaretLeftIcon } from '@/assets/icon/caret-left';
import { ClockIcon } from '@/assets/icon/clock';
import { HammerIcon } from '@/assets/icon/hammer-icon';
import { MapPinIcon } from '@/assets/icon/map-pin';
import { Body1, Body2, Heading2 } from '@/atomic/typography';
import {
  SOLICITATION_STATUS_META,
  type SolicitationStatus,
} from '@/components/client-solicitation-card';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

import type { LawyerSolicitationCardData } from './mock-lawyer-solicitations';

export type LawyerSolicitationCardProps = LawyerSolicitationCardData & {
  onPress?: () => void;
};

export function LawyerSolicitationCard({
  clientName,
  status,
  description,
  timeLabel,
  timeKind,
  location,
  specialty,
  isUnviewed,
  onPress,
}: LawyerSolicitationCardProps) {
  const statusMeta = SOLICITATION_STATUS_META[status as SolicitationStatus];
  const TimeIcon = timeKind === 'relative' ? ClockIcon : CalendarIcon;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [pressed && onPress ? styles.cardPressed : null]}>
      <View
        collapsable={false}
        style={[
          styles.clip,
          isUnviewed ? { backgroundColor: statusMeta.accentColor } : null,
        ]}
        testID={isUnviewed ? 'solicitation-card-accent' : undefined}>
        <View
          style={[styles.content, isUnviewed ? styles.contentAccented : null]}
          testID="solicitation-card-panel">
          <View style={styles.topRow}>
            <View style={styles.nameStatus}>
              <Heading2 color={BrandColors.neutral.white} numberOfLines={1} style={styles.name}>
                {clientName}
              </Heading2>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: statusMeta.accentColor }]} />
                <Body2 color={statusMeta.labelColor} numberOfLines={1}>
                  {statusMeta.label}
                </Body2>
              </View>
            </View>
            <CaretLeftIcon
              color={BrandColors.neutral.white}
              direction="right"
              width={20}
              height={20}
            />
          </View>

          <Body1 color={BrandColors.neutral.white} numberOfLines={2}>
            {description}
          </Body1>

          <View style={styles.metaBlock}>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <TimeIcon color={BrandColors.neutral.white} width={16} height={16} />
                <Body2 color={BrandColors.neutral.white}>{timeLabel}</Body2>
              </View>
              <View style={styles.metaItem}>
                <MapPinIcon color={BrandColors.neutral.white} width={16} height={16} />
                <Body2 color={BrandColors.neutral.white} numberOfLines={1} style={styles.location}>
                  {location}
                </Body2>
              </View>
            </View>
            {specialty ? (
              <View style={styles.metaItem}>
                <HammerIcon color={BrandColors.neutral.white} width={16} height={16} />
                <Body2 color={BrandColors.neutral.white} numberOfLines={1} style={styles.specialty}>
                  {specialty}
                </Body2>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const ACCENT_WIDTH = 8;
const INNER_ACCENT_RADIUS = Radius.large - ACCENT_WIDTH;

const styles = StyleSheet.create({
  clip: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: Radius.large,
    backgroundColor: BrandColors.accessory.darkGray,
  },
  cardPressed: {
    opacity: 0.88,
  },
  content: {
    gap: Spacing.xs,
    padding: Spacing.sm,
    backgroundColor: BrandColors.accessory.darkGray,
  },
  contentAccented: {
    marginLeft: ACCENT_WIDTH,
    borderTopLeftRadius: INNER_ACCENT_RADIUS,
    borderBottomLeftRadius: INNER_ACCENT_RADIUS,
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxxs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metaBlock: {
    gap: Spacing.xxs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxxs,
    flexShrink: 1,
  },
  location: {
    flexShrink: 1,
  },
  specialty: {
    flexShrink: 1,
  },
});
