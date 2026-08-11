import { SymbolView } from 'expo-symbols';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { LoadingState } from '@/atomic/loading-state';
import { Body2, Display, Link } from '@/atomic/typography';
import { ClientFlowScreen } from '@/components/client-flow-screen';
import {
  CancelClientSolicitationModal,
  ClientCompatibleLawyersList,
  ClientSolicitationDataAccordion,
  ClientSolicitationDescriptionAccordion,
  ClientSolicitationDetailsShimmer,
} from '@/components/client-solicitation-details';
import { BrandColors, Spacing } from '@/constants/theme';
import type { ConnectionResult } from '@/data/connection';
import { getErrorMessage } from '@/data/http';
import { useSolicitationConnections } from '@/domain/connection';
import {
  useCancelClientSolicitation,
  useClientSolicitationDetails,
} from '@/domain/solicitation';

export default function ClientSolicitationDetailsScreen() {
  const router = useRouter();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const { id } = useLocalSearchParams<{ id: string }>();
  const solicitationId = Array.isArray(id) ? id[0] : id;

  const {
    solicitation,
    isLoading,
    isError,
    error,
    refetch,
  } = useClientSolicitationDetails(solicitationId);

  const { data: connections = [] } = useSolicitationConnections(solicitationId);
  const cancelSolicitation = useCancelClientSolicitation();

  const connectionsByLawyerId = useMemo(() => {
    const map: Record<string, ConnectionResult> = {};
    for (const connection of connections) {
      map[connection.advogadoId] = connection;
    }
    return map;
  }, [connections]);

  const handleConfirmCancel = async () => {
    if (!solicitationId) {
      return;
    }

    try {
      await cancelSolicitation.mutateAsync(solicitationId);
      setCancelModalVisible(false);
      router.back();
    } catch (cancelError) {
      Alert.alert(
        'Cancelar solicitação',
        getErrorMessage(
          cancelError,
          'Não foi possível cancelar a solicitação.',
        ),
      );
    }
  };

  const hasData = Boolean(solicitation);
  const showLoading = isLoading && !hasData;
  const showError = isError && !hasData;

  return (
    <>
      <ClientFlowScreen
        title="Visualizar Solicitação"
        onBack={() => router.back()}
        contentContainerStyle={styles.content}>
        <LoadingState
          data={hasData}
          error={showError}
          loading={showLoading}
          style={styles.loadingState}>
          <LoadingState.Shimmer>
            <ClientSolicitationDetailsShimmer />
          </LoadingState.Shimmer>

          <LoadingState.ErrorPlaceholder>
            <View style={styles.notFound}>
              <Display color={BrandColors.neutral.white}>
                Solicitação não encontrada
              </Display>
              {error ? (
                <Body2 color={BrandColors.neutral.light} style={styles.errorMessage}>
                  {getErrorMessage(error, 'Não foi possível carregar a solicitação.')}
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
          </LoadingState.ErrorPlaceholder>

          <LoadingState.EmptyState>
            <View style={styles.notFound}>
              <Display color={BrandColors.neutral.white}>
                Solicitação não encontrada
              </Display>
            </View>
          </LoadingState.EmptyState>

          {solicitation ? (
            <>
              <ClientSolicitationDataAccordion solicitation={solicitation} />
              <ClientSolicitationDescriptionAccordion
                description={solicitation.description}
              />
              <ClientCompatibleLawyersList
                connectionsByLawyerId={connectionsByLawyerId}
                lawyers={solicitation.compatibleLawyers}
                onLawyerPress={(lawyerId) =>
                  router.push(
                    `/client/advogado/${lawyerId}?solicitacaoId=${encodeURIComponent(solicitation.id)}`,
                  )
                }
                solicitacaoId={solicitation.id}
              />

              {solicitation.canCancel ? (
                <Pressable
                  accessibilityLabel="Cancelar solicitação"
                  accessibilityRole="button"
                  disabled={cancelSolicitation.isPending}
                  onPress={() => setCancelModalVisible(true)}
                  style={({ pressed }) => [
                    styles.cancelButton,
                    pressed && styles.pressed,
                    cancelSolicitation.isPending && styles.cancelDisabled,
                  ]}>
                  {cancelSolicitation.isPending ? (
                    <ActivityIndicator color={BrandColors.feedback.error.medium} />
                  ) : (
                    <>
                      <SymbolView
                        name={{ ios: 'trash', android: 'delete', web: 'delete' }}
                        size={18}
                        tintColor={BrandColors.feedback.error.medium}
                      />
                      <Link color={BrandColors.feedback.error.medium}>
                        Cancelar solicitação
                      </Link>
                    </>
                  )}
                </Pressable>
              ) : null}
            </>
          ) : null}
        </LoadingState>
      </ClientFlowScreen>
      <CancelClientSolicitationModal
        onClose={() => {
          if (!cancelSolicitation.isPending) {
            setCancelModalVisible(false);
          }
        }}
        onConfirm={() => {
          void handleConfirmCancel();
        }}
        visible={cancelModalVisible}
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: Spacing.lg,
  },
  loadingState: {
    gap: Spacing.sm,
  },
  cancelButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xxs,
  },
  cancelDisabled: {
    opacity: 0.6,
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
  pressed: {
    opacity: 0.75,
  },
});
