import { StyleSheet, View } from 'react-native';

import { Heading1 } from '@/atomic/typography';
import { UnlockedContactActions } from '@/components/unlocked-contacts/unlocked-contact-actions.component';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

import type { LawyerClientProfile } from './mock-lawyer-solicitation-details';

type LawyerClientContactsCardProps = {
  client: LawyerClientProfile;
};

export function LawyerClientContactsCard({
  client,
}: LawyerClientContactsCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.accent} />
      <View style={styles.content}>
        <Heading1 color={BrandColors.neutral.white}>
          Contatos do cliente
        </Heading1>
        <UnlockedContactActions
          email={client.email}
          iconSize={22}
          phone={client.phone}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: Radius.medium,
    backgroundColor: BrandColors.neutral.dark,
  },
  accent: {
    width: 6,
    backgroundColor: BrandColors.primary.light,
  },
  content: {
    flex: 1,
    gap: Spacing.xs,
    padding: Spacing.sm,
  },
});
