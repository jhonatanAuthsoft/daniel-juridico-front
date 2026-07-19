import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
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
};

export function ClientLawyerReviews({
  reviews,
  total,
  canReview = false,
}: ClientLawyerReviewsProps) {
  const [expanded, setExpanded] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [currentReviews, setCurrentReviews] = useState(() => reviews);
  const [currentTotal, setCurrentTotal] = useState(total);
  const [reviewToDeleteId, setReviewToDeleteId] = useState<string | null>(null);
  const visibleReviews = expanded
    ? currentReviews
    : currentReviews.slice(0, INITIAL_VISIBLE_REVIEWS);
  const canExpand = currentReviews.length > INITIAL_VISIBLE_REVIEWS;
  const hasOwnReview = currentReviews.some((review) => review.isOwn);
  const canCreateReview = canReview && !hasOwnReview;

  const deleteOwnReview = () => {
    if (!reviewToDeleteId) {
      return;
    }

    setCurrentReviews((current) =>
      current.filter((review) => review.id !== reviewToDeleteId),
    );
    setCurrentTotal((current) => Math.max(0, current - 1));
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
                onDelete={() => setReviewToDeleteId(review.id)}
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
                      accessibilityLabel={`${review.rating} de 5 estrelas`}
                      style={styles.stars}>
                      {'★'.repeat(review.rating)}
                    </Text>
                    <Body2 color={BrandColors.neutral.white}>
                      {review.rating} estrelas
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
        onClose={() => setReviewToDeleteId(null)}
        onConfirm={deleteOwnReview}
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
