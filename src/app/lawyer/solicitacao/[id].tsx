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
import { SafeAreaView } from 'react-native-safe-area-context';

import { CaretLeftIcon } from '@/assets/icon/caret-left';
import { Button } from '@/atomic/button';
import { Body1, Display, Heading1, Link } from '@/atomic/typography';
import { LawyerSolicitationDecisionCard } from '@/components/lawyer-solicitation-details';
import { BrandColors, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { getErrorMessage } from '@/data/http';
import {
  useAcceptConnection,
  useConnections,
  useRejectConnection,
} from '@/domain/connection';

export default function LawyerSolicitationDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const connectionId = Array.isArray(id) ? id[0] : id;

  const {
    data: connections = [],
    isLoading,
    isError,
    refetch,
  } = useConnections();

  const acceptConnection = useAcceptConnection();
  const rejectConnection = useRejectConnection();

  const connection = useMemo(
    () => connections.find((item) => item.id === connectionId),
    [connectionId, connections],
  );

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
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFound}>
          <ActivityIndicator color={BrandColors.primary.light} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !connection) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFound}>
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
      </SafeAreaView>
    );
  }

  const isPending = connection.status === 'PENDENTE';
  const decision =
    connection.status === 'ACEITA'
      ? 'accepted'
      : connection.status === 'RECUSADA'
        ? 'rejected'
        : null;
  const isMutating =
    acceptConnection.isPending || rejectConnection.isPending;

  return (
    <SafeAreaView
      edges={['top', 'bottom', 'left', 'right']}
      style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
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
            Pedido de conexão
          </Body1>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.card}>
          <Heading1 color={BrandColors.neutral.white}>
            {connection.nomeCliente?.trim() || 'Cliente'}
          </Heading1>
          <Body1 color={BrandColors.neutral.light}>
            {connection.tituloSolicitacao?.trim() || 'Solicitação'}
          </Body1>
          {connection.status === 'ACEITA' ? (
            <Body1 color={BrandColors.neutral.white}>
              Conexão aceita. O cliente pode ver seu telefone e e-mail no
              perfil.
            </Body1>
          ) : null}
        </View>

        {decision ? (
          <LawyerSolicitationDecisionCard decision={decision} />
        ) : null}

        {isPending ? (
          <View style={styles.actions}>
            <Button
              accessibilityLabel="Aceitar conexão"
              disabled={isMutating}
              isLoading={acceptConnection.isPending}
              onPress={() => {
                void handleAccept();
              }}
              variant="primary">
              Aceitar conexão
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BrandColors.neutral.xdark,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.xxs,
    paddingBottom: Spacing.lg,
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
  card: {
    gap: Spacing.xs,
    padding: Spacing.sm,
    borderRadius: Radius.large,
    backgroundColor: BrandColors.accessory.darkGray,
  },
  actions: {
    gap: Spacing.xs,
    marginTop: Spacing.xxs,
  },
  refuseButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFound: {
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
