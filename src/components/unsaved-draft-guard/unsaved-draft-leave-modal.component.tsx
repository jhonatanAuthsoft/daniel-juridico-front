import { SymbolView } from 'expo-symbols';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Body1, Heading1, Link } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

export type UnsavedDraftLeaveModalProps = {
  visible: boolean;
  itemLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function UnsavedDraftLeaveModal({
  visible,
  itemLabel,
  onCancel,
  onConfirm,
}: UnsavedDraftLeaveModalProps) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onCancel}
      transparent
      visible={visible}>
      <View style={styles.overlay}>
        <View
          accessibilityRole="alert"
          accessibilityViewIsModal
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
              Alterações não salvas
            </Heading1>
            <Body1 color={BrandColors.neutral.white} style={styles.description}>
              {`A ${itemLabel} não foi salva. Se continuar, esses dados serão perdidos.`}
            </Body1>
          </View>
          <View style={styles.actions}>
            <Pressable
              accessibilityLabel="Cancelar"
              accessibilityRole="button"
              onPress={onCancel}
              style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
              <Link color={BrandColors.primary.light}>Cancelar</Link>
            </Pressable>
            <Pressable
              accessibilityLabel="Continuar"
              accessibilityRole="button"
              onPress={onConfirm}
              style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
              <Link color={BrandColors.primary.light}>Continuar</Link>
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
