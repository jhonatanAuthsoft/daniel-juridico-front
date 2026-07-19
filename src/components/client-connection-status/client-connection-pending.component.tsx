import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Body1, Heading1, Link } from '@/atomic/typography';
import { BrandColors, Spacing } from '@/constants/theme';

import { CancelConnectionModal } from './cancel-connection-modal.component';
import { ClientConnectionStatusCard } from './client-connection-status-card.component';

type ClientConnectionPendingProps = {
  onCancel: () => void;
};

export function ClientConnectionPending({
  onCancel,
}: ClientConnectionPendingProps) {
  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  const confirmCancellation = () => {
    setCancelModalVisible(false);
    onCancel();
  };

  return (
    <>
      <ClientConnectionStatusCard>
        <Heading1 color={BrandColors.neutral.white}>
          Solicitação enviada
        </Heading1>
        <View style={styles.statusRow}>
          <SymbolView
            name={{ ios: 'hourglass', android: 'hourglass_empty', web: 'hourglass_empty' }}
            size={24}
            tintColor={BrandColors.neutral.white}
          />
          <Body1 color={BrandColors.neutral.white}>
            Aguardando resposta...
          </Body1>
        </View>
        <Pressable
          accessibilityLabel="Cancelar conexão"
          accessibilityRole="button"
          onPress={() => setCancelModalVisible(true)}
          style={({ pressed }) => [
            styles.cancelButton,
            pressed && styles.pressed,
          ]}>
          <Link color={BrandColors.feedback.error.medium}>
            Cancelar conexão
          </Link>
        </Pressable>
      </ClientConnectionStatusCard>

      <CancelConnectionModal
        onClose={() => setCancelModalVisible(false)}
        onConfirm={confirmCancellation}
        visible={cancelModalVisible}
      />
    </>
  );
}

const styles = StyleSheet.create({
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  cancelButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});
