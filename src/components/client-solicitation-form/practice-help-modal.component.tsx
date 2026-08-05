import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { XIcon } from '@/assets/icon/x';
import { Body1, Heading1 } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

type PracticeHelpModalProps = {
  visible: boolean;
  onClose: () => void;
};

const PRACTICE_DEFINITIONS = [
  {
    title: 'Pautista',
    description:
      'Atua realizando audiências e diligências pontuais para outros advogados ou escritórios.',
  },
  {
    title: 'Generalista',
    description:
      'Trabalha com diferentes áreas do direito, atendendo diversos tipos de demandas.',
  },
  {
    title: 'Correspondente jurídico',
    description:
      'Presta serviços de apoio jurídico, como protocolos, cópias de processos e acompanhamento em fóruns.',
  },
  {
    title: 'Especialista',
    description:
      'Advogado com foco em uma área específica do direito (ex: trabalhista, família, penal).',
  },
] as const;

/**
 * Explains lawyer practice types next to the "Atuação" field.
 */
export function PracticeHelpModal({ visible, onClose }: PracticeHelpModalProps) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}>
      <View style={styles.overlay}>
        <Pressable
          accessibilityLabel="Fechar ajuda"
          accessibilityRole="button"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <View
          accessibilityRole="summary"
          accessibilityViewIsModal
          style={styles.dialog}>
          <View style={styles.header}>
            <Heading1 color={BrandColors.neutral.white} style={styles.title}>
              Atuação do advogado
            </Heading1>
            <Pressable
              accessibilityLabel="Fechar"
              accessibilityRole="button"
              hitSlop={Spacing.xxs}
              onPress={onClose}
              style={({ pressed }) => pressed && styles.pressed}>
              <XIcon color={BrandColors.neutral.white} width={18} height={18} />
            </Pressable>
          </View>

          <Body1 color={BrandColors.neutral.white}>
            A atuação indica como o advogado trabalha ou o tipo de serviço que
            ele oferece. Escolha a opção que melhor representa o perfil que você
            procura.
          </Body1>

          <View style={styles.definitions}>
            {PRACTICE_DEFINITIONS.map((item) => (
              <Text key={item.title} style={styles.definitionLine}>
                <Body1 color={BrandColors.primary.light}>{item.title}</Body1>
                <Body1 color={BrandColors.neutral.white}>
                  {' – '}
                  {item.description}
                </Body1>
              </Text>
            ))}
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
    gap: Spacing.sm,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: BrandColors.neutral.medium,
    borderRadius: Radius.medium,
    backgroundColor: BrandColors.neutral.dark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  title: {
    flex: 1,
  },
  definitions: {
    gap: Spacing.sm,
  },
  definitionLine: {
    flexShrink: 1,
  },
  pressed: {
    opacity: 0.75,
  },
});
