import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/atomic/button';
import { Body1, Body2, Heading1, Link } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

import { ClientOwnReviewCard } from './client-own-review-card.component';
import { ClientReviewFormModal } from './client-review-form-modal.component';
import { DeleteReviewConfirmationModal } from './delete-review-confirmation-modal.component';

const INITIAL_VISIBLE_REVIEWS = 3;

export type ClientLawyerReview = {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  isOwn?: boolean;
};

type ClientLawyerReviewsProps = {
  reviews: ClientLawyerReview[];
  total: number;
  canReview?: boolean;
  /** When set, own reviews show delete and call this on confirm. */
  onDeleteOwnReview?: (reviewId: string) => Promise<void>;
  isDeletingOwn?: boolean;
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

export function ClientLawyerReviews({
  reviews,
  total,
  canReview = false,
  onDeleteOwnReview,
  isDeletingOwn = false,
}: ClientLawyerReviewsProps) {
  const [expanded, setExpanded] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [currentReviews, setCurrentReviews] = useState(() => reviews);
  const [currentTotal, setCurrentTotal] = useState(total);
  const [reviewToDeleteId, setReviewToDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setCurrentReviews(reviews);
    setCurrentTotal(total);
  }, [reviews, total]);

  const visibleReviews = expanded
    ? currentReviews
    : currentReviews.slice(0, INITIAL_VISIBLE_REVIEWS);
  const canExpand = currentReviews.length > INITIAL_VISIBLE_REVIEWS;
  const hasOwnReview = currentReviews.some((review) => review.isOwn);
  const canCreateReview = canReview && !hasOwnReview;
  const canDeleteOwn = typeof onDeleteOwnReview === 'function';

  const deleteOwnReview = async () => {
    if (!reviewToDeleteId || !onDeleteOwnReview || isDeletingOwn) {
      return;
    }

    await onDeleteOwnReview(reviewToDeleteId);
    setReviewToDeleteId(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.divider} />

      <View style={styles.header}>
        <Heading1 color={BrandColors.neutral.white}>Avaliações</Heading1>
        <Heading1 color={BrandColors.neutral.white}>({currentTotal})</Heading1>
      </View>

      {canCreateReview ? (
        <Button
          accessibilityLabel={
            reviewSubmitted ? 'Avaliação enviada' : 'Deixar uma avaliação'
          }
          disabled={reviewSubmitted}
          onPress={() => setReviewModalVisible(true)}
          variant="secondary">
          {reviewSubmitted ? 'Avaliação enviada' : 'Deixar uma avaliação'}
        </Button>
      ) : null}

      <View style={styles.list}>
        {visibleReviews.map((review) => {
          if (review.isOwn) {
            return (
              <ClientOwnReviewCard
                key={review.id}
                onDelete={
                  canDeleteOwn
                    ? () => setReviewToDeleteId(review.id)
                    : undefined
                }
                review={review}
              />
            );
          }

          return (
            <View
              key={review.id}
              testID="lawyer-review-card"
              style={styles.card}>
              <View style={styles.reviewerRow}>
                <Image
                  source={require('@/assets/images/professional-image-placeholder.png')}
                  contentFit="cover"
                  style={styles.avatar}
                />
                <View style={styles.reviewerInfo}>
                  <Body1 color={BrandColors.neutral.white}>
                    {review.reviewerName}
                  </Body1>
                  <View style={styles.ratingRow}>
                    <Text
                      accessibilityLabel={formatRatingLabel(review.rating)}
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
            </View>
          );
        })}
      </View>

      {canExpand ? (
        <Pressable
          accessibilityLabel={
            expanded ? 'Ver menos avaliações' : 'Veja mais avaliações'
          }
          accessibilityRole="button"
          onPress={() => setExpanded((current) => !current)}
          style={({ pressed }) => [
            styles.expandButton,
            pressed && styles.pressed,
          ]}>
          <SymbolView
            name={{
              ios: expanded ? 'chevron.up' : 'chevron.down',
              android: expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down',
              web: expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down',
            }}
            size={20}
            tintColor={BrandColors.primary.light}
          />
          <Link color={BrandColors.primary.light}>
            {expanded ? 'Ver menos avaliações' : 'Veja mais avaliações'}
          </Link>
        </Pressable>
      ) : null}

      <ClientReviewFormModal
        onClose={() => setReviewModalVisible(false)}
        onSubmit={() => {
          setReviewSubmitted(true);
          setReviewModalVisible(false);
        }}
        visible={reviewModalVisible}
      />
      <DeleteReviewConfirmationModal
        isDeleting={isDeletingOwn}
        onClose={() => {
          if (!isDeletingOwn) {
            setReviewToDeleteId(null);
          }
        }}
        onConfirm={() => {
          void deleteOwnReview();
        }}
        visible={reviewToDeleteId !== null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: BrandColors.neutral.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  list: {
    gap: Spacing.xs,
  },
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
    width: 56,
    height: 56,
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
  expandButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xxs,
  },
  pressed: {
    opacity: 0.75,
  },
});
