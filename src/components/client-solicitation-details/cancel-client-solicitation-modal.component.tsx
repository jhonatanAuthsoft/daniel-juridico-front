import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { InfoAlertIcon } from '@/assets/icon/info-alert';
import { Body1, Heading1, Link } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

type CancelClientSolicitationModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function CancelClientSolicitationModal({
  visible,
  onClose,
  onConfirm,
}: CancelClientSolicitationModalProps) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}>
      <View style={styles.overlay}>
        <View
          accessibilityRole="alert"
          accessibilityViewIsModal
          style={styles.dialog}>
          <InfoAlertIcon
            testID="info-alert-icon"
            color={BrandColors.neutral.white}
            width={28}
            height={28}
          />

          <View style={styles.copy}>
            <Heading1 color={BrandColors.neutral.white}>
              Deseja cancelar a solicitação?
            </Heading1>
            <Body1 color={BrandColors.neutral.white} style={styles.description}>
              Deixaremos de buscar advogados compatíveis com sua demanda. Esta
              ação é irreversível.
            </Body1>
          </View>

          <View style={styles.actions}>
            <Pressable
              accessibilityLabel="Fechar"
              accessibilityRole="button"
              onPress={onClose}
              style={({ pressed }) => [
                styles.action,
                pressed && styles.pressed,
              ]}>
              <Link color={BrandColors.primary.light} numberOfLines={1}>
                Fechar
              </Link>
            </Pressable>
            <Pressable
              accessibilityLabel="Confirmar cancelamento da solicitação"
              accessibilityRole="button"
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.action,
                pressed && styles.pressed,
              ]}>
              <Link color={BrandColors.primary.light} numberOfLines={1}>
                Cancelar solicitação
              </Link>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
    backgroundColor: 'rgba(18, 20, 24, 0.82)',
  },
  dialog: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: BrandColors.neutral.medium,
    borderRadius: Radius.medium,
    backgroundColor: BrandColors.neutral.dark,
  },
  copy: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  description: {
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: Spacing.sm,
  },
  action: {
    minHeight: 44,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});
