import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CaretLeftIcon } from '@/assets/icon/caret-left';
import { Button } from '@/atomic/button';
import { Body1, Display, Link } from '@/atomic/typography';
import {
  LawyerClientContactsCard,
  LawyerClientProfileAccordion,
  LawyerClientReviewCard,
  LawyerEmergencyAttentionBanner,
  LawyerSolicitationDataAccordion,
  LawyerSolicitationDecisionCard,
  LawyerSolicitationDescriptionAccordion,
} from '@/components/lawyer-solicitation-details';
import { BrandColors, MaxContentWidth, Spacing } from '@/constants/theme';
import { getErrorMessage } from '@/data/http';
import { useSpecialtiesCatalog } from '@/domain/catalog';
import {
  isEmergencyConnection,
  mapConnectionToLawyerSolicitationDetails,
  useAcceptConnection,
  useConnections,
  useRejectConnection,
} from '@/domain/connection';

export default function LawyerSolicitationDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const connectionId = Array.isArray(id) ? id[0] : id;

  const {
    data: connections = [],
    isLoading,
    isError,
    refetch,
  } = useConnections();

  const catalogQuery = useSpecialtiesCatalog();
  const acceptConnection = useAcceptConnection();
  const rejectConnection = useRejectConnection();

  const connection = useMemo(
    () => connections.find((item) => item.id === connectionId),
    [connectionId, connections],
  );

  const details = useMemo(() => {
    if (!connection) {
      return null;
    }

    const specialty = catalogQuery.data?.items.find(
      (item) => item.code === connection.especialidadeCodigo,
    );
    const subspecialty = specialty?.subspecialties.find(
      (item) => item.code === connection.subespecialidadeCodigo,
    );

    return mapConnectionToLawyerSolicitationDetails(connection, {
      specialtyLabel: specialty?.name,
      subspecialtyLabel: subspecialty?.name,
    });
  }, [catalogQuery.data, connection]);

  const handleAccept = async () => {
    if (!connectionId) {
      return;
    }
    try {
      await acceptConnection.mutateAsync(connectionId);
    } catch (error) {
      Alert.alert(
        'Conexão',
        getErrorMessage(error, 'Não foi possível aceitar a conexão.'),
      );
    }
  };

  const handleReject = async () => {
    if (!connectionId) {
      return;
    }
    try {
      await rejectConnection.mutateAsync(connectionId);
      router.back();
    } catch (error) {
      Alert.alert(
        'Conexão',
        getErrorMessage(error, 'Não foi possível recusar a conexão.'),
      );
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.centered}>
          <ActivityIndicator color={BrandColors.primary.light} size="large" />
        </View>
      </View>
    );
  }

  if (isError || !connection || !details) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.centered}>
          <Display color={BrandColors.neutral.white}>
            Pedido não encontrado
          </Display>
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
      </View>
    );
  }

  const isPending = connection.status === 'PENDENTE';
  const isAccepted = connection.status === 'ACEITA';
  const isMutating =
    acceptConnection.isPending || rejectConnection.isPending;
  const showEmergencyBanner =
    isEmergencyConnection(connection) && connection.status !== 'RECUSADA';

  return (
    <View style={styles.root}>
      <View style={[styles.headerBlock, { paddingTop: insets.top + Spacing.xxs }]}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Voltar"
            accessibilityRole="button"
            hitSlop={Spacing.xxs}
            onPress={() => router.back()}
            style={({ pressed }) => pressed && styles.pressed}>
            <CaretLeftIcon color={BrandColors.neutral.white} height={24} width={24} />
          </Pressable>
          <Body1 color={BrandColors.neutral.white} style={styles.headerTitle}>
            Visualizar solicitação
          </Body1>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom:
              Spacing.lg +
              (isPending || isAccepted ? 120 : Spacing.sm) +
              insets.bottom,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <LawyerClientProfileAccordion client={details.client} />
        <LawyerSolicitationDataAccordion solicitation={details} />
        {isAccepted ? (
          <LawyerClientContactsCard client={details.client} />
        ) : null}
        <LawyerSolicitationDescriptionAccordion
          description={details.description}
        />
        <LawyerEmergencyAttentionBanner visible={showEmergencyBanner} />
        {details.decision === 'rejected' ? (
          <LawyerSolicitationDecisionCard decision="rejected" />
        ) : null}
        {details.clientReview ? (
          <LawyerClientReviewCard
            client={details.client}
            review={details.clientReview}
          />
        ) : null}
      </ScrollView>

      {isPending ? (
        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, Spacing.sm) },
          ]}>
          <Button
            accessibilityLabel="Aceitar solicitação"
            disabled={isMutating}
            isLoading={acceptConnection.isPending}
            onPress={() => {
              void handleAccept();
            }}
            variant="primary">
            Aceitar solicitação
          </Button>
          <Pressable
            accessibilityLabel="Recusar"
            accessibilityRole="button"
            disabled={isMutating}
            onPress={() => {
              void handleReject();
            }}
            style={({ pressed }) => [
              styles.refuseButton,
              pressed && !isMutating && styles.pressed,
              isMutating && styles.disabled,
            ]}>
            <Link color={BrandColors.primary.light}>
              {rejectConnection.isPending ? 'Recusando…' : 'Recusar'}
            </Link>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BrandColors.neutral.xdark,
  },
  headerBlock: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.sm,
    backgroundColor: BrandColors.neutral.xdark,
  },
  header: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
    backgroundColor: BrandColors.neutral.xdark,
  },
  refuseButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.sm,
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.5,
  },
});
