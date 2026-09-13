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
  averageRating?: number | null;
  canReview?: boolean;
  /** Show the Avaliações block even when there are no comments yet. */
  alwaysVisible?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
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

function formatAverageRating(rating: number): string {
  return rating.toFixed(1).replace('.', ',');
}

export function ClientLawyerReviews({
  reviews,
  total,
  averageRating = null,
  canReview = false,
  alwaysVisible = false,
  isLoading = false,
  isError = false,
  onRetry,
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
  const showAverage =
    averageRating != null && (total > 0 || averageRating > 0);
  const averageLabel =
    averageRating != null ? formatAverageRating(averageRating) : '';

  if (!hasReviews && !canReview && !alwaysVisible && !isLoading && !isError) {
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

      {showAverage && averageRating != null ? (
        <View style={styles.summary}>
          <StarRating
            accessibilityLabel={`${averageLabel} ${averageRating === 1 ? 'estrela' : 'estrelas'} em média`}
            rating={averageRating}
            size={20}
          />
          <Body1 color={BrandColors.neutral.white}>{averageLabel}</Body1>
        </View>
      ) : null}

      {canReview ? (
        <Button
          accessibilityLabel="Deixar uma avaliação"
          onPress={() => setReviewModalVisible(true)}
          variant="secondary">
          Deixar uma avaliação
        </Button>
      ) : null}

      {isLoading && reviews.length === 0 ? (
        <ActivityIndicator color={BrandColors.primary.light} />
      ) : null}

      {isError && reviews.length === 0 ? (
        <View style={styles.errorBlock}>
          <Body2 color={BrandColors.neutral.light}>
            Não foi possível carregar as avaliações
          </Body2>
          {onRetry ? (
            <Pressable
              accessibilityLabel="Tentar novamente"
              accessibilityRole="button"
              onPress={onRetry}>
              <Link color={BrandColors.primary.light}>Tentar novamente</Link>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {!isLoading && !isError && reviews.length === 0 && total === 0 ? (
        <Body2 color={BrandColors.neutral.light}>Nenhuma avaliação ainda.</Body2>
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
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  errorBlock: {
    gap: Spacing.xxs,
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
