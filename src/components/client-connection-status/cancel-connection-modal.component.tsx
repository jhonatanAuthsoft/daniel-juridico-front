import { SymbolView } from 'expo-symbols';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Body1, Heading1, Link } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

type CancelConnectionModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function CancelConnectionModal({
  visible,
  onClose,
  onConfirm,
}: CancelConnectionModalProps) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}>
      <View style={styles.overlay}>
        <View
          accessibilityViewIsModal
          accessibilityRole="alert"
          style={styles.dialog}>
          <SymbolView
            name={{
              ios: 'exclamationmark.triangle',
              android: 'warning_amber',
              web: 'warning_amber',
            }}
            size={28}
            tintColor={BrandColors.neutral.white}
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
              <Link color={BrandColors.primary.light}>Fechar</Link>
            </Pressable>
            <Pressable
              accessibilityLabel="Cancelar solicitação"
              accessibilityRole="button"
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.action,
                pressed && styles.pressed,
              ]}>
              <Link color={BrandColors.primary.light}>
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
    padding: Spacing.md,
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
    justifyContent: 'space-around',
    gap: Spacing.sm,
  },
  action: {
    minHeight: 44,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});
