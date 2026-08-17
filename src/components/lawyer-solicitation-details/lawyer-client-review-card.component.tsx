import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Body1, Body2, Heading2 } from '@/atomic/typography';
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
      <Heading2 color={BrandColors.neutral.white}>Avaliação do cliente</Heading2>
      <View style={styles.card}>
        <View style={styles.reviewerRow}>
          <Image
            accessibilityIgnoresInvertColors
            contentFit="cover"
            source={avatarSource}
            style={styles.avatar}
          />
          <View style={styles.reviewerInfo}>
            <Body1 color={BrandColors.neutral.white}>{client.name}</Body1>
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
  stars: {
    color: BrandColors.feedback.warning.medium,
    fontSize: 20,
    letterSpacing: 2,
  },
});
