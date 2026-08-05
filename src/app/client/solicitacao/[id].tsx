import { SymbolView } from 'expo-symbols';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Body2, Display, Link } from '@/atomic/typography';
import { ClientFlowScreen } from '@/components/client-flow-screen';
import {
  CancelClientSolicitationModal,
  ClientCompatibleLawyersList,
  ClientSolicitationDataAccordion,
  ClientSolicitationDescriptionAccordion,
} from '@/components/client-solicitation-details';
import { BrandColors, Spacing } from '@/constants/theme';
import { getErrorMessage } from '@/data/http';
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

  const cancelSolicitation = useCancelClientSolicitation();

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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFound}>
          <ActivityIndicator color={BrandColors.primary.light} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !solicitation) {
    return (
      <ClientFlowScreen title="Visualizar Solicitação" onBack={() => router.back()}>
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
      </ClientFlowScreen>
    );
  }

  return (
    <>
      <ClientFlowScreen
        title="Visualizar Solicitação"
        onBack={() => router.back()}
        contentContainerStyle={styles.content}>
        <ClientSolicitationDataAccordion solicitation={solicitation} />
        <ClientSolicitationDescriptionAccordion
          description={solicitation.description}
        />
        <ClientCompatibleLawyersList
          lawyers={solicitation.compatibleLawyers}
          onLawyerPress={(lawyerId) =>
            router.push(`/client/advogado/${lawyerId}`)
          }
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
  safeArea: {
    flex: 1,
    backgroundColor: BrandColors.neutral.xdark,
  },
  content: {
    paddingBottom: Spacing.lg,
  },
  cancelButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xxs,
    marginTop: Spacing.sm,
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
