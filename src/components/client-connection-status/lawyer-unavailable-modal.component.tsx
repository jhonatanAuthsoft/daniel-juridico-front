import { SymbolView } from 'expo-symbols';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Body1, Heading1, Link } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

type LawyerUnavailableModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function LawyerUnavailableModal({
  visible,
  onClose,
}: LawyerUnavailableModalProps) {
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
              ios: 'exclamationmark.triangle',
              android: 'warning_amber',
              web: 'warning_amber',
            }}
            size={28}
            tintColor={BrandColors.neutral.white}
          />

          <View style={styles.copy}>
            <Heading1 color={BrandColors.neutral.white}>
              Advogado indisponível
            </Heading1>
            <Body1 color={BrandColors.neutral.white} style={styles.description}>
              Este advogado está com o perfil indisponível e não pode receber
              novas solicitações agora. Você ainda pode visualizar o perfil
              dele.
            </Body1>
          </View>

          <Pressable
            accessibilityLabel="Entendi"
            accessibilityRole="button"
            onPress={onClose}
            style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
            <Link color={BrandColors.primary.light}>Entendi</Link>
          </Pressable>
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
  action: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});
