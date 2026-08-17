import { StyleSheet, View } from 'react-native';

import { ShieldWarningIcon } from '@/assets/icon/shield-warning';
import { Body1, Heading1 } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

export const LAWYER_EMERGENCY_ATTENTION_MESSAGE =
  'Orientamos seu cliente a ligar 190. Seguimos tentando contato com você para o suporte jurídico.';

export const CLIENT_EMERGENCY_ATTENTION_MESSAGE =
  'Se estiver em situação de emergência policial, ligue imediatamente para o 190. Ainda assim continuaremos procurando seu advogado';

type EmergencyAttentionBannerProps = {
  message: string;
  /** When false, renders nothing. Defaults to true. */
  visible?: boolean;
  testID?: string;
};

/**
 * Shared “Atenção” / 190 emergency notice used on lawyer and client flows.
 */
export function EmergencyAttentionBanner({
  message,
  visible = true,
  testID = 'emergency-attention-banner',
}: EmergencyAttentionBannerProps) {
  if (!visible) {
    return null;
  }

  return (
    <View
      accessibilityLabel="Atenção: emergência"
      accessibilityRole="summary"
      style={styles.card}
      testID={testID}>
      <View style={styles.accent} />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <ShieldWarningIcon size={24} />
          <Heading1 color={BrandColors.neutral.white}>Atenção</Heading1>
        </View>
        <Body1 color={BrandColors.neutral.white}>{message}</Body1>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: Radius.medium,
    backgroundColor: BrandColors.neutral.dark,
  },
  accent: {
    width: 6,
    backgroundColor: BrandColors.primary.light,
  },
  content: {
    flex: 1,
    gap: Spacing.xs,
    padding: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
});
