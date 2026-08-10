import { Image } from 'expo-image';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { BagIcon } from '@/assets/icon/bag';
import { MapPinIcon } from '@/assets/icon/map-pin';
import { PercentIcon } from '@/assets/icon/percent';
import { Button } from '@/atomic/button';
import { Body2, Heading1 } from '@/atomic/typography';
import type { ClientConnectionStatusValue } from '@/components/client-connection-status';
import { BrandColors, Radius, Spacing } from '@/constants/theme';
import { getErrorMessage } from '@/data/http';
import type { ConnectionResult } from '@/data/connection';
import { useCreateConnection } from '@/domain/connection';

import type { CompatibleLawyer } from './mock-client-solicitation-details';

type ClientCompatibleLawyersListProps = {
  lawyers: CompatibleLawyer[];
  solicitacaoId: string;
  connectionsByLawyerId: Record<string, ConnectionResult>;
  onLawyerPress: (lawyerId: string) => void;
};

function connectionButtonLabel(
  uiStatus: ClientConnectionStatusValue,
): string {
  switch (uiStatus) {
    case 'pending':
      return 'Conexão solicitada';
    case 'accepted':
      return 'Conexão aceita';
    case 'rejected':
      return 'Conexão recusada';
    default:
      return 'Solicitar conexão';
  }
}

export function ClientCompatibleLawyersList({
  lawyers,
  solicitacaoId,
  connectionsByLawyerId,
  onLawyerPress,
}: ClientCompatibleLawyersListProps) {
  const createConnection = useCreateConnection();

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
        const canRequest = uiStatus === 'idle';
        const isRequestingThis =
          createConnection.isPending &&
          createConnection.variables?.advogadoId === lawyer.id;

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
                    <Image
                      testID="professional-image-placeholder"
                      source={require('@/assets/images/professional-image-placeholder.png')}
                      contentFit="cover"
                      style={styles.avatarImage}
                    />
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

              <Button
                accessibilityLabel={connectionButtonLabel(uiStatus)}
                disabled={!canRequest}
                isLoading={isRequestingThis}
                onPress={() => {
                  void requestConnection(lawyer.id);
                }}
                variant="secondary">
                {connectionButtonLabel(uiStatus)}
              </Button>
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
  pressed: {
    opacity: 0.75,
  },
});
