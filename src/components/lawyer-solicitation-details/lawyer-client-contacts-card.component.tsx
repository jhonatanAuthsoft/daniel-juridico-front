import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { Body1, Heading1 } from '@/atomic/typography';
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
        <View style={styles.contact}>
          <SymbolView
            name={{ ios: 'phone', android: 'call', web: 'call' }}
            size={22}
            tintColor={BrandColors.neutral.white}
          />
          <Body1 color={BrandColors.neutral.white} style={styles.value}>
            {client.phone}
          </Body1>
        </View>
        <View style={styles.contact}>
          <SymbolView
            name={{ ios: 'envelope', android: 'mail', web: 'mail' }}
            size={22}
            tintColor={BrandColors.neutral.white}
          />
          <Body1 color={BrandColors.neutral.white} style={styles.value}>
            {client.email}
          </Body1>
        </View>
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
  contact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  value: {
    flexShrink: 1,
    textDecorationLine: 'underline',
  },
});
