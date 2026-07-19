import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { Body1, Heading1 } from '@/atomic/typography';
import { BrandColors, Spacing } from '@/constants/theme';

import { ClientConnectionStatusCard } from './client-connection-status-card.component';

export function ClientConnectionRejected() {
  return (
    <ClientConnectionStatusCard>
      <Heading1 color={BrandColors.neutral.white}>
        Solicitação recusada
      </Heading1>
      <View style={styles.statusRow}>
        <SymbolView
          name={{ ios: 'xmark.circle', android: 'cancel', web: 'cancel' }}
          size={26}
          tintColor={BrandColors.neutral.white}
        />
        <Body1 color={BrandColors.neutral.white}>
          Sua solicitação foi recusada
        </Body1>
      </View>
    </ClientConnectionStatusCard>
  );
}

const styles = StyleSheet.create({
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
});
