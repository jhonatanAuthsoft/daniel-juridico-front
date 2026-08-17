import { Image } from 'expo-image';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { BagIcon } from '@/assets/icon/bag';
import { MapPinIcon } from '@/assets/icon/map-pin';
import { PercentIcon } from '@/assets/icon/percent';
import { Button } from '@/atomic/button';
import { Body2, Heading1, Link } from '@/atomic/typography';
import { CancelConnectionModal } from '@/components/client-connection-status/cancel-connection-modal.component';
import type { ClientConnectionStatusValue } from '@/components/client-connection-status';
import { BrandColors, Radius, Spacing } from '@/constants/theme';
import { getErrorMessage } from '@/data/http';
import type { ConnectionResult } from '@/data/connection';
import { useObjectReadUrl } from '@/domain/arquivo';
import {
  useCancelConnection,
  useCreateConnection,
} from '@/domain/connection';

import type { CompatibleLawyer } from './mock-client-solicitation-details';

type ClientCompatibleLawyersListProps = {
  lawyers: CompatibleLawyer[];
  solicitacaoId: string;
  connectionsByLawyerId: Record<string, ConnectionResult>;
  onLawyerPress: (lawyerId: string) => void;
};

type LawyerActionProps = {
  lawyer: CompatibleLawyer;
  uiStatus: ClientConnectionStatusValue;
  connection: ConnectionResult | undefined;
  isRequesting: boolean;
  isCancelling: boolean;
  onLawyerPress: (lawyerId: string) => void;
  onRequest: (lawyerId: string) => void;
  onCancel: (connectionId: string) => void;
};

const PROFESSIONAL_PLACEHOLDER = require(
  '@/assets/images/professional-image-placeholder.png',
);

function CompatibleLawyerPhoto({ photoKey }: { photoKey: string | null }) {
  const { data: read } = useObjectReadUrl(photoKey);
  const uri = read?.readUrl?.trim();

  return (
    <Image
      testID="compatible-lawyer-photo"
      source={uri ? { uri } : PROFESSIONAL_PLACEHOLDER}
      contentFit="cover"
      style={styles.avatarImage}
    />
  );
}

function LawyerConnectionAction({
  lawyer,
  uiStatus,
  connection,
  isRequesting,
  isCancelling,
  onLawyerPress,
  onRequest,
  onCancel,
}: LawyerActionProps) {
  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  if (uiStatus === 'accepted') {
    return (
      <Button
        accessibilityLabel="Exibir contato"
        onPress={() => onLawyerPress(lawyer.id)}
        variant="primary">
        Exibir contato
      </Button>
    );
  }

  if (uiStatus === 'pending' && connection) {
    return (
      <>
        <Pressable
          accessibilityLabel="Cancelar solicitação"
          accessibilityRole="button"
          disabled={isCancelling}
          onPress={() => setCancelModalVisible(true)}
          style={({ pressed }) => [
            styles.cancelAction,
            pressed && !isCancelling && styles.pressed,
            isCancelling && styles.disabled,
          ]}>
          <Link color={BrandColors.primary.light}>
            {isCancelling ? 'Cancelando…' : 'Cancelar solicitação'}
          </Link>
        </Pressable>
        <CancelConnectionModal
          onClose={() => {
            if (!isCancelling) {
              setCancelModalVisible(false);
            }
          }}
          onConfirm={() => {
            setCancelModalVisible(false);
            onCancel(connection.id);
          }}
          visible={cancelModalVisible}
        />
      </>
    );
  }

  if (uiStatus === 'rejected') {
    return (
      <View style={styles.rejectedAction}>
        <Link color={BrandColors.neutral.light}>Conexão recusada</Link>
      </View>
    );
  }

  return (
    <Button
      accessibilityLabel={isRequesting ? 'Solicitando conexão' : 'Solicitar conexão'}
      disabled={isRequesting}
      onPress={() => onRequest(lawyer.id)}
      variant="secondary">
      {isRequesting ? 'Solicitando…' : 'Solicitar conexão'}
    </Button>
  );
}

export function ClientCompatibleLawyersList({
  lawyers,
  solicitacaoId,
  connectionsByLawyerId,
  onLawyerPress,
}: ClientCompatibleLawyersListProps) {
  const createConnection = useCreateConnection();
  const cancelConnection = useCancelConnection();

  const requestConnection = async (lawyerId: string) => {
    try {
      await createConnection.mutateAsync({
        solicitacaoId,
        advogadoId: lawyerId,
      });
    } catch (error) {
      Alert.alert(
        'Conexão',
        getErrorMessage(error, 'Não foi possível solicitar a conexão.'),
      );
    }
  };

  const cancelPendingConnection = async (connectionId: string) => {
    try {
      await cancelConnection.mutateAsync(connectionId);
    } catch (error) {
      Alert.alert(
        'Conexão',
        getErrorMessage(error, 'Não foi possível cancelar a solicitação.'),
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Heading1 color={BrandColors.neutral.white} style={styles.headerTitle}>
          Advogados compatíveis
        </Heading1>
        <Heading1 color={BrandColors.neutral.white}>({lawyers.length})</Heading1>
      </View>

      {lawyers.map((lawyer, index) => {
        const connection = connectionsByLawyerId[lawyer.id];
        const uiStatus = connection?.uiStatus ?? 'idle';
        const isRequestingThis =
          createConnection.isPending &&
          createConnection.variables?.advogadoId === lawyer.id;
        const isCancellingThis =
          cancelConnection.isPending &&
          cancelConnection.variables === connection?.id;

        return (
          <View key={lawyer.id}>
            {index > 0 ? <View style={styles.divider} /> : null}
            <View style={styles.lawyerCard}>
              <Pressable
                accessibilityLabel={`Visualizar perfil de ${lawyer.name}`}
                accessibilityRole="button"
                onPress={() => onLawyerPress(lawyer.id)}
                style={({ pressed }) => [
                  styles.profileLink,
                  pressed && styles.pressed,
                ]}>
                <View style={styles.profileRow}>
                  <View
                    style={[
                      styles.avatar,
                      { backgroundColor: lawyer.avatarColor },
                    ]}>
                    <CompatibleLawyerPhoto photoKey={lawyer.photoUrl} />
                  </View>

                  <View style={styles.profileContent}>
                    <View style={styles.nameRow}>
                      <Heading1
                        color={BrandColors.neutral.white}
                        numberOfLines={1}
                        style={styles.name}>
                        {lawyer.name}
                      </Heading1>
                      <Body2 color={BrandColors.neutral.white}>
                        <Text style={styles.star}>★</Text> {lawyer.rating}
                      </Body2>
                    </View>
                    <View style={styles.availabilityRow}>
                      <View style={styles.availableDot} />
                      <Body2 color={BrandColors.neutral.light}>
                        {lawyer.availability}
                      </Body2>
                    </View>
                  </View>
                </View>

                <View style={styles.metaRow}>
                  <MapPinIcon
                    color={BrandColors.neutral.white}
                    width={16}
                    height={16}
                  />
                  <Body2 color={BrandColors.neutral.white}>
                    {lawyer.location}
                  </Body2>
                </View>
                <View style={styles.metaRow}>
                  <BagIcon
                    color={BrandColors.neutral.white}
                    width={16}
                    height={16}
                  />
                  <Body2 color={BrandColors.neutral.white}>{lawyer.role}</Body2>
                </View>
                <View style={styles.metaRow}>
                  <PercentIcon
                    color={BrandColors.neutral.white}
                    width={16}
                    height={16}
                  />
                  <Body2 color={BrandColors.neutral.white}>
                    {lawyer.compatibility}% de compatibilidade
                  </Body2>
                </View>
              </Pressable>

              <LawyerConnectionAction
                connection={connection}
                isCancelling={isCancellingThis}
                isRequesting={isRequestingThis}
                lawyer={lawyer}
                onCancel={(connectionId) => {
                  void cancelPendingConnection(connectionId);
                }}
                onLawyerPress={onLawyerPress}
                onRequest={(lawyerId) => {
                  void requestConnection(lawyerId);
                }}
                uiStatus={uiStatus}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: Spacing.sm,
    borderRadius: Radius.large,
    backgroundColor: BrandColors.accessory.darkGray,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  headerTitle: {
    flex: 1,
  },
  lawyerCard: {
    gap: Spacing.xxs,
    paddingTop: Spacing.sm,
  },
  profileLink: {
    gap: Spacing.xxs,
    borderRadius: Radius.medium,
  },
  divider: {
    height: 1,
    marginTop: Spacing.sm,
    backgroundColor: BrandColors.neutral.medium,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.medium,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  profileContent: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  name: {
    flex: 1,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxxs,
  },
  availableDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BrandColors.feedback.success.medium,
  },
  star: {
    color: BrandColors.feedback.warning.medium,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxxs,
  },
  cancelAction: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectedAction: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.5,
  },
});
