import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Body2, Display, Link } from '@/atomic/typography';
import { AccountStackScreen } from '@/components/client-edit-data';
import { ClientLawyerReviews } from '@/components/client-lawyer-reviews';
import { LawyerPublicProfileView } from '@/components/lawyer-public-profile';
import { BrandColors, Spacing } from '@/constants/theme';
import { getErrorMessage } from '@/data/http';
import { mapLawyerReviewsToClientReviews } from '@/data/lawyer';
import { useAuth } from '@/domain/auth';
import { useLawyerReviews, usePublicLawyerProfile } from '@/domain/lawyer';

export function LawyerProfilePreviewScreen() {
  const { user } = useAuth();
  const lawyerId = user?.id;
  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch,
  } = usePublicLawyerProfile(lawyerId);

  const reviewsQuery = useLawyerReviews(profile?.id ?? lawyerId);
  const reviewPages = reviewsQuery.data?.pages ?? [];
  const reviewItems = reviewPages.flatMap((page) => page.items);
  const reviewsData = reviewPages[0];
  const reviewsTotal = reviewsData?.total ?? profile?.totalReviews ?? 0;
  const reviewsAverage =
    reviewsData?.averageRating && reviewsData.averageRating > 0
      ? reviewsData.averageRating
      : (profile?.averageRating ?? null);

  if (isLoading) {
    return (
      <AccountStackScreen title="Visualizar perfil">
        <View style={styles.centered}>
          <ActivityIndicator color={BrandColors.primary.light} size="large" />
        </View>
      </AccountStackScreen>
    );
  }

  if (isError || !profile) {
    return (
      <AccountStackScreen title="Visualizar perfil">
        <View style={styles.centered}>
          <Display color={BrandColors.neutral.white}>
            Não foi possível carregar o perfil
          </Display>
          {error ? (
            <Body2 color={BrandColors.neutral.light} style={styles.errorMessage}>
              {getErrorMessage(error, 'Tente novamente em instantes.')}
            </Body2>
          ) : null}
          <Pressable
            accessibilityLabel="Tentar novamente"
            accessibilityRole="button"
            onPress={() => {
              void refetch();
            }}>
            <Link color={BrandColors.primary.light}>Tentar novamente</Link>
          </Pressable>
        </View>
      </AccountStackScreen>
    );
  }

  return (
    <AccountStackScreen title="Visualizar perfil">
      <LawyerPublicProfileView
        profile={profile}
        reviews={
          <ClientLawyerReviews
            alwaysVisible
            averageRating={reviewsAverage}
            canReview={false}
            hasNextPage={reviewsQuery.hasNextPage}
            isError={reviewsQuery.isError}
            isFetchingNextPage={reviewsQuery.isFetchingNextPage}
            isLoading={reviewsQuery.isPending}
            onLoadMore={() => {
              void reviewsQuery.fetchNextPage();
            }}
            onRetry={() => {
              void reviewsQuery.refetch();
            }}
            reviews={mapLawyerReviewsToClientReviews(reviewItems)}
            total={reviewsTotal}
          />
        }
      />
    </AccountStackScreen>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
  },
  errorMessage: {
    textAlign: 'center',
  },
});
