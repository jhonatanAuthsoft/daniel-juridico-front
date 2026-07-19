import { SymbolView } from 'expo-symbols';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Body1, Heading1, Link } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

type DeleteReviewConfirmationModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteReviewConfirmationModal({
  visible,
  onClose,
  onConfirm,
}: DeleteReviewConfirmationModalProps) {
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
          <SymbolView
            name={{
              ios: 'trash',
              android: 'delete',
              web: 'delete',
            }}
            size={28}
            tintColor={BrandColors.feedback.error.medium}
          />
          <View style={styles.copy}>
            <Heading1 color={BrandColors.neutral.white}>
              Excluir avaliação?
            </Heading1>
            <Body1 color={BrandColors.neutral.white} style={styles.description}>
              Tem certeza de que deseja excluir sua avaliação? Esta ação é
              irreversível.
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
              accessibilityLabel="Confirmar exclusão da avaliação"
              accessibilityRole="button"
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.action,
                pressed && styles.pressed,
              ]}>
              <Link color={BrandColors.feedback.error.medium}>
                Excluir avaliação
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
