import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { CaretLeftIcon } from '@/assets/icon/caret-left';
import { StarRating } from '@/assets/icon/star';
import { Button } from '@/atomic/button';
import { Body1, Body2, Heading1, Link } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

import { ClientOwnReviewCard } from './client-own-review-card.component';
import { ClientReviewFormModal } from './client-review-form-modal.component';
import { DeleteReviewConfirmationModal } from './delete-review-confirmation-modal.component';

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
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
  /** When set, own reviews show delete and call this on confirm. */
  onDeleteOwnReview?: (reviewId: string) => Promise<void>;
  isDeletingOwn?: boolean;
  onSubmitReview?: (payload: {
    rating: number;
    comment: string;
  }) => Promise<void>;
  isSubmittingReview?: boolean;
};

function formatRatingLabel(rating: number): string {
  const formatted = Number.isInteger(rating)
    ? String(rating)
    : rating.toFixed(1).replace('.', ',');
  return `${formatted} ${rating === 1 ? 'estrela' : 'estrelas'}`;
}

export function ClientLawyerReviews({
  reviews,
  total,
  canReview = false,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
  onDeleteOwnReview,
  isDeletingOwn = false,
  onSubmitReview,
  isSubmittingReview = false,
}: ClientLawyerReviewsProps) {
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewToDeleteId, setReviewToDeleteId] = useState<string | null>(null);

  const canDeleteOwn = typeof onDeleteOwnReview === 'function';
  const hasReviews = reviews.length > 0 || total > 0;

  if (!hasReviews && !canReview) {
    return null;
  }

  const deleteOwnReview = async () => {
    if (!reviewToDeleteId || !onDeleteOwnReview || isDeletingOwn) {
      return;
    }

    await onDeleteOwnReview(reviewToDeleteId);
    setReviewToDeleteId(null);
  };

  const submitReview = async (payload: {
    rating: number;
    comment: string;
  }) => {
    if (!onSubmitReview || isSubmittingReview) {
      return;
    }
    setReviewModalVisible(false);
    await onSubmitReview(payload);
  };

  return (
    <View style={styles.container}>
      <View style={styles.divider} />

      <View style={styles.header}>
        <Heading1 color={BrandColors.neutral.white}>Avaliações</Heading1>
        <Heading1 color={BrandColors.neutral.white}>({total})</Heading1>
      </View>

      {canReview ? (
        <Button
          accessibilityLabel="Deixar uma avaliação"
          onPress={() => setReviewModalVisible(true)}
          variant="secondary">
          Deixar uma avaliação
        </Button>
      ) : null}

      <View style={styles.list}>
        {reviews.map((review) => {
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
                  source={require('@/assets/images/no-image-placeholder.png')}
                  contentFit="cover"
                  style={styles.avatar}
                />
                <View style={styles.reviewerInfo}>
                  <Body1 color={BrandColors.neutral.white}>
                    {review.reviewerName}
                  </Body1>
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
            </View>
          );
        })}
      </View>

      {hasNextPage ? (
        isFetchingNextPage ? (
          <ActivityIndicator color={BrandColors.primary.light} />
        ) : (
          <Pressable
            accessibilityLabel="Ver mais"
            accessibilityRole="button"
            onPress={onLoadMore}
            style={({ pressed }) => [
              styles.expandButton,
              pressed && styles.pressed,
            ]}>
            <CaretLeftIcon
              color={BrandColors.primary.light}
              direction="down"
              height={20}
              width={20}
            />
            <Link color={BrandColors.primary.light}>Ver mais</Link>
          </Pressable>
        )
      ) : null}

      <ClientReviewFormModal
        isSubmitting={isSubmittingReview}
        onClose={() => setReviewModalVisible(false)}
        onSubmit={(payload) => {
          void submitReview(payload);
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
