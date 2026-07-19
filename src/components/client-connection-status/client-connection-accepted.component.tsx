import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { Body1, Heading1 } from '@/atomic/typography';
import { BrandColors, Spacing } from '@/constants/theme';

import { ClientConnectionStatusCard } from './client-connection-status-card.component';

type ClientConnectionAcceptedProps = {
  phone: string;
  email: string;
};

export function ClientConnectionAccepted({
  phone,
  email,
}: ClientConnectionAcceptedProps) {
  return (
    <ClientConnectionStatusCard>
      <Heading1 color={BrandColors.neutral.white}>Solicitação aceita</Heading1>
      <Body1 color={BrandColors.neutral.white}>
        Entre em contato com o(a) advogado(a)
      </Body1>
      <View style={styles.contactRow}>
        <SymbolView
          name={{ ios: 'phone', android: 'call', web: 'call' }}
          size={24}
          tintColor={BrandColors.neutral.white}
        />
        <Body1 color={BrandColors.neutral.white} style={styles.contact}>
          {phone}
        </Body1>
      </View>
      <View style={styles.contactRow}>
        <SymbolView
          name={{ ios: 'envelope', android: 'mail', web: 'mail' }}
          size={24}
          tintColor={BrandColors.neutral.white}
        />
        <Body1 color={BrandColors.neutral.white} style={styles.contact}>
          {email}
        </Body1>
      </View>
    </ClientConnectionStatusCard>
  );
}

const styles = StyleSheet.create({
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  contact: {
    flexShrink: 1,
    textDecorationLine: 'underline',
  },
});
