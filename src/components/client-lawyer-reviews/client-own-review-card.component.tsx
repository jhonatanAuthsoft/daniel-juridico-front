import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { StarRating } from '@/assets/icon/star';
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
            <StarRating
              accessibilityLabel={formatRatingLabel(review.rating)}
              rating={review.rating}
              size={20}
            />
            <Body2 color={BrandColors.neutral.white}>
              {formatRatingLabel(review.rating)}
            </Body2>
          </View>
        </View>
      </View>

      {review.comment ? (
        <Body1 color={BrandColors.neutral.white}>{review.comment}</Body1>
      ) : null}

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
