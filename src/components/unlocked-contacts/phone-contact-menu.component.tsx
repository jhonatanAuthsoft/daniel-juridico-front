import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { XIcon } from '@/assets/icon/x';
import { ModalScrim } from '@/atomic/modal';
import { Body1 } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

type PhoneContactMenuProps = {
  visible: boolean;
  onClose: () => void;
  onCall: () => void;
  onSms: () => void;
  onWhatsApp: () => void;
};

export function PhoneContactMenu({
  visible,
  onClose,
  onCall,
  onSms,
  onWhatsApp,
}: PhoneContactMenuProps) {
  if (!visible) {
    return null;
  }

  return (
    <Modal
      animationType="fade"
      navigationBarTranslucent
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible>
      <ModalScrim
        accessibilityLabel="Fechar opções de telefone"
        align="bottom"
        onDismiss={onClose}>
        <View style={styles.panel}>
          <View style={styles.header}>
            <Body1 bold color={BrandColors.neutral.white} style={styles.title}>
              Como deseja entrar em contato?
            </Body1>
            <Pressable
              accessibilityLabel="Fechar"
              accessibilityRole="button"
              hitSlop={Spacing.xxs}
              onPress={onClose}>
              <XIcon color={BrandColors.neutral.white} />
            </Pressable>
          </View>
          <Pressable
            accessibilityLabel="Ligar"
            accessibilityRole="button"
            onPress={onCall}
            style={({ pressed }) => [styles.option, pressed && styles.pressed]}>
            <Body1 color={BrandColors.neutral.white}>Ligar</Body1>
          </Pressable>
          <Pressable
            accessibilityLabel="SMS"
            accessibilityRole="button"
            onPress={onSms}
            style={({ pressed }) => [styles.option, pressed && styles.pressed]}>
            <Body1 color={BrandColors.neutral.white}>SMS</Body1>
          </Pressable>
          <Pressable
            accessibilityLabel="WhatsApp"
            accessibilityRole="button"
            onPress={onWhatsApp}
            style={({ pressed }) => [
              styles.option,
              styles.optionLast,
              pressed && styles.pressed,
            ]}>
            <Body1 color={BrandColors.neutral.white}>WhatsApp</Body1>
          </Pressable>
        </View>
      </ModalScrim>
    </Modal>
  );
}

const styles = StyleSheet.create({
  panel: {
    overflow: 'hidden',
    borderRadius: Radius.medium,
    borderWidth: 1,
    borderColor: BrandColors.accessory.darkBlue,
    backgroundColor: BrandColors.neutral.xdark,
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  title: {
    flex: 1,
  },
  option: {
    minHeight: 48,
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(230, 232, 227, 0.24)',
  },
  optionLast: {
    borderBottomWidth: 0,
  },
  pressed: {
    opacity: 0.75,
  },
});
