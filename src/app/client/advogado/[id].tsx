import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Body2, Display, Link } from '@/atomic/typography';
import { useBanner } from '@/atomic/feedback-banner';
import {
  ClientConnectionStatus,
  LawyerUnavailableModal,
} from '@/components/client-connection-status';
import { ClientFlowScreen } from '@/components/client-flow-screen';
import { ClientLawyerReviews } from '@/components/client-lawyer-reviews';
import { LawyerPublicProfileView } from '@/components/lawyer-public-profile';
import { BrandColors, Spacing } from '@/constants/theme';
import { getErrorCode, getErrorMessage } from '@/data/http';
import { mapLawyerReviewsToClientReviews } from '@/data/lawyer';
import {
  useCancelConnection,
  useCreateConnection,
  useLawyerConnectionStatus,
} from '@/domain/connection';
import {
  useCreateLawyerReview,
  useDeleteLawyerReview,
  useLawyerReviews,
  usePublicLawyerProfile,
} from '@/domain/lawyer';

export default function ClientLawyerProfileScreen() {
  const router = useRouter();
  const banner = useBanner();
  const { id, solicitacaoId: solicitacaoIdParam } = useLocalSearchParams<{
    id: string;
    solicitacaoId?: string;
  }>();
  const lawyerId = Array.isArray(id) ? id[0] : id;
  const solicitacaoId = Array.isArray(solicitacaoIdParam)
    ? solicitacaoIdParam[0]
    : solicitacaoIdParam;

  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch,
  } = usePublicLawyerProfile(lawyerId);

  const reviewsQuery = useLawyerReviews(lawyerId);
  const reviewPages = reviewsQuery.data?.pages ?? [];
  const reviewItems = reviewPages.flatMap((page) => page.items);
  const reviewsData = reviewPages[0];
  const reviewsTotal = reviewsData?.total ?? profile?.totalReviews ?? 0;
  const reviewsAverage =
    reviewsData?.averageRating && reviewsData.averageRating > 0
      ? reviewsData.averageRating
      : (profile?.averageRating ?? null);
  const deleteReview = useDeleteLawyerReview();
  const createReview = useCreateLawyerReview();

  const { data: connection } = useLawyerConnectionStatus(
    lawyerId,
    solicitacaoId,
  );
  const createConnection = useCreateConnection();
  const cancelConnection = useCancelConnection();
  const [unavailableModalVisible, setUnavailableModalVisible] = useState(false);

  if (isLoading) {
    return (
      <ClientFlowScreen title="Visualizar perfil" onBack={() => router.back()}>
        <View style={styles.notFound}>
          <ActivityIndicator color={BrandColors.primary.light} size="large" />
        </View>
      </ClientFlowScreen>
    );
  }

  if (isError || !profile) {
    return (
      <ClientFlowScreen title="Visualizar perfil" onBack={() => router.back()}>
        <View style={styles.notFound}>
          <Display color={BrandColors.neutral.white}>
            Profissional não encontrado
          </Display>
          {error ? (
            <Body2 color={BrandColors.neutral.light} style={styles.errorMessage}>
              {getErrorMessage(error, 'Não foi possível carregar o perfil.')}
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
          <Pressable
            accessibilityLabel="Voltar"
            accessibilityRole="button"
            onPress={() => router.back()}>
            <Link color={BrandColors.primary.light}>Voltar</Link>
          </Pressable>
        </View>
      </ClientFlowScreen>
    );
  }

  return (
    <ClientFlowScreen
      title="Visualizar perfil"
      onBack={() => router.back()}
      contentContainerStyle={styles.content}>
      <LawyerPublicProfileView
        profile={profile}
        reviews={
          <ClientLawyerReviews
            averageRating={reviewsAverage}
            canReview={reviewsData?.canReview ?? false}
            hasNextPage={reviewsQuery.hasNextPage}
            isDeletingOwn={deleteReview.isPending}
            isError={reviewsQuery.isError}
            isFetchingNextPage={reviewsQuery.isFetchingNextPage}
            isLoading={reviewsQuery.isPending}
            isSubmittingReview={createReview.isPending}
            onRetry={() => {
              void reviewsQuery.refetch();
            }}
            onDeleteOwnReview={async (reviewId) => {
              try {
                await deleteReview.mutateAsync({
                  lawyerUserId: profile.id,
                  reviewId,
                });
              } catch (error) {
                banner(
                  getErrorMessage(error, 'Não foi possível excluir a avaliação.'),
                  'error',
                );
                throw error;
              }
            }}
            onLoadMore={() => {
              void reviewsQuery.fetchNextPage();
            }}
            onSubmitReview={async ({ rating, comment }) => {
              try {
                await createReview.mutateAsync({
                  lawyerUserId: profile.id,
                  rating,
                  comment,
                });
              } catch (error) {
                banner(
                  getErrorMessage(error, 'Não foi possível enviar a avaliação.'),
                  'error',
                );
              }
            }}
            reviews={mapLawyerReviewsToClientReviews(reviewItems)}
            total={reviewsTotal}
          />
        }
        footer={
          <>
            {solicitacaoId ? (
              <ClientConnectionStatus
                email={connection?.email ?? ''}
                isCancelling={cancelConnection.isPending}
                isRequesting={createConnection.isPending}
                onCancel={() => {
                  if (!connection?.id) {
                    return;
                  }
                  void (async () => {
                    try {
                      await cancelConnection.mutateAsync(connection.id);
                    } catch (cancelError) {
                      banner(
                        getErrorMessage(
                          cancelError,
                          'Não foi possível cancelar a conexão.',
                        ),
                        'error',
                      );
                    }
                  })();
                }}
                onRequest={() => {
                  if (!lawyerId || !solicitacaoId) {
                    return;
                  }
                  if (!profile.isAvailable) {
                    setUnavailableModalVisible(true);
                    return;
                  }
                  void (async () => {
                    try {
                      await createConnection.mutateAsync({
                        solicitacaoId,
                        advogadoId: lawyerId,
                      });
                    } catch (requestError) {
                      if (getErrorCode(requestError) === 'LAWYER_UNAVAILABLE') {
                        setUnavailableModalVisible(true);
                        return;
                      }
                      banner(
                        getErrorMessage(
                          requestError,
                          'Não foi possível solicitar a conexão.',
                        ),
                        'error',
                      );
                    }
                  })();
                }}
                phone={connection?.telefone ?? ''}
                status={connection?.uiStatus ?? 'idle'}
              />
            ) : null}

            <LawyerUnavailableModal
              onClose={() => setUnavailableModalVisible(false)}
              visible={unavailableModalVisible}
            />
          </>
        }
      />
    </ClientFlowScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: Spacing.lg,
  },
  notFound: {
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
