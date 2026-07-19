import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BagIcon } from '@/assets/icon/bag';
import { MapPinIcon } from '@/assets/icon/map-pin';
import { Button } from '@/atomic/button';
import { Body2, Heading1 } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

import type { CompatibleLawyer } from './mock-client-solicitation-details';

type ClientCompatibleLawyersListProps = {
  lawyers: CompatibleLawyer[];
  onLawyerPress: (lawyerId: string) => void;
};

export function ClientCompatibleLawyersList({
  lawyers,
  onLawyerPress,
}: ClientCompatibleLawyersListProps) {
  const [requestedLawyerIds, setRequestedLawyerIds] = useState<Set<string>>(
    new Set(),
  );

  const requestConnection = (lawyerId: string) => {
    setRequestedLawyerIds((current) => new Set(current).add(lawyerId));
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
        const connectionRequested = requestedLawyerIds.has(lawyer.id);

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
              </Pressable>

              <Button
                accessibilityLabel={
                  connectionRequested
                    ? 'Conexão solicitada'
                    : 'Solicitar conexão'
                }
                disabled={connectionRequested}
                onPress={() => requestConnection(lawyer.id)}
                variant="secondary">
                {connectionRequested
                  ? 'Conexão solicitada'
                  : 'Solicitar conexão'}
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
