import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Body1, Body2, Link } from '@/atomic/typography';
import { ProfileAvatar } from '@/components/profile-avatar';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

import type { ClientLawyerReview } from './client-lawyer-reviews.component';

type ClientOwnReviewCardProps = {
  review: ClientLawyerReview;
  onDelete?: () => void;
};

function formatRatingLabel(rating: number): string {
  const formatted = Number.isInteger(rating)
    ? String(rating)
    : rating.toFixed(1).replace('.', ',');
  return `${formatted} ${rating === 1 ? 'estrela' : 'estrelas'}`;
}

function formatStars(rating: number): string {
  const full = Math.max(0, Math.min(5, Math.floor(rating)));
  const hasHalf = rating - full >= 0.5 && full < 5;
  return `${'★'.repeat(full)}${hasHalf ? '½' : ''}`;
}

export function ClientOwnReviewCard({
  review,
  onDelete,
}: ClientOwnReviewCardProps) {
  return (
    <View testID="lawyer-review-card" style={styles.card}>
      <View style={styles.reviewerRow}>
        <ProfileAvatar style={styles.avatar} testID="client-review-avatar" />
        <View style={styles.reviewerInfo}>
          <Body1 color={BrandColors.neutral.white}>Você</Body1>
          <View style={styles.ratingRow}>
            <Text
              accessibilityLabel={`${formatRatingLabel(review.rating)}`}
              style={styles.stars}>
              {formatStars(review.rating)}
            </Text>
            <Body2 color={BrandColors.neutral.white}>
              {formatRatingLabel(review.rating)}
            </Body2>
          </View>
        </View>
      </View>

      <Body1 color={BrandColors.neutral.white}>{review.comment}</Body1>

      {onDelete ? (
        <Pressable
          accessibilityLabel="Excluir avaliação"
          accessibilityRole="button"
          onPress={onDelete}
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && styles.pressed,
          ]}>
          <SymbolView
            name={{ ios: 'trash', android: 'delete', web: 'delete' }}
            size={20}
            tintColor={BrandColors.feedback.error.medium}
          />
          <Link color={BrandColors.feedback.error.medium}>
            Excluir avaliação
          </Link>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: Radius.large,
    backgroundColor: BrandColors.neutral.dark,
  },
  reviewerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: Radius.medium,
    backgroundColor: BrandColors.neutral.medium,
  },
  reviewerInfo: {
    flex: 1,
    gap: Spacing.xxxs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.xxs,
  },
  stars: {
    color: BrandColors.feedback.warning.medium,
    fontSize: 20,
    letterSpacing: 2,
  },
  deleteButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xxs,
  },
  pressed: {
    opacity: 0.75,
  },
});
