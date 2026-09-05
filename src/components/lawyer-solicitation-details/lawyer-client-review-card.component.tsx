import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { StarRating } from '@/assets/icon/star';
import { Body1, Body2, Heading1, Heading2 } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';
import { useObjectReadUrl } from '@/domain/arquivo';

import type {
  LawyerClientProfile,
  LawyerClientReview,
} from './mock-lawyer-solicitation-details';

type LawyerClientReviewCardProps = {
  client: LawyerClientProfile;
  review: LawyerClientReview;
};

const STAR_SIZE = 16;

function formatRatingLabel(rating: number): string {
  const formatted = Number.isInteger(rating)
    ? String(rating)
    : rating.toFixed(1).replace('.', ',');
  return `${formatted} ${rating === 1 ? 'estrela' : 'estrelas'}`;
}

export function LawyerClientReviewCard({
  client,
  review,
}: LawyerClientReviewCardProps) {
  const photoKey = client.photoKey?.trim() || null;
  const { data: photo } = useObjectReadUrl(photoKey);
  const photoUrl = photo?.readUrl?.trim();
  const avatarSource = photoUrl
    ? { uri: photoUrl }
    : require('@/assets/images/no-image-placeholder.png');

  return (
    <View style={styles.section} testID="lawyer-client-review">
      <Heading1 color={BrandColors.neutral.white}>Avaliação do cliente</Heading1>
      <View style={styles.card}>
        <View style={styles.reviewerRow}>
          <Image
            accessibilityIgnoresInvertColors
            contentFit="cover"
            source={avatarSource}
            style={styles.avatar}
          />
          <View style={styles.reviewerInfo}>
            <Heading2 color={BrandColors.neutral.white}>{client.name}</Heading2>
            <View
              accessibilityLabel={formatRatingLabel(review.rating)}
              style={styles.ratingRow}>
              <StarRating rating={review.rating} size={STAR_SIZE} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
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
});
