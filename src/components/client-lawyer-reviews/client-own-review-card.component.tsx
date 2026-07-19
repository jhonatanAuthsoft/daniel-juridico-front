import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Body1, Body2, Link } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

import type { ClientLawyerReview } from './client-lawyer-reviews.component';

type ClientOwnReviewCardProps = {
  review: ClientLawyerReview;
  onDelete: () => void;
};

export function ClientOwnReviewCard({
  review,
  onDelete,
}: ClientOwnReviewCardProps) {
  return (
    <View testID="lawyer-review-card" style={styles.card}>
      <View style={styles.reviewerRow}>
        <Image
          source={require('@/assets/images/professional-image-placeholder.png')}
          contentFit="cover"
          style={styles.avatar}
        />
        <View style={styles.reviewerInfo}>
          <Body1 color={BrandColors.neutral.white}>Você</Body1>
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
