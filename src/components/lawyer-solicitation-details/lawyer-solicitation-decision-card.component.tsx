import { StyleSheet, View } from 'react-native';

import { CheckIcon } from '@/assets/icon/check';
import { CloseCircleIcon } from '@/assets/icon/close-circle';
import { Body1, Heading1 } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

type LawyerSolicitationDecision = 'accepted' | 'rejected';

type LawyerSolicitationDecisionCardProps = {
  decision: LawyerSolicitationDecision;
};

const DECISION_COPY = {
  accepted: {
    title: 'Solicitação Aceita',
    message:
      'Solicitação aceita. As informações de contato do cliente estão disponíveis.',
    accent: BrandColors.feedback.success.medium,
    iconColor: BrandColors.feedback.success.medium,
  },
  rejected: {
    title: 'Solicitação Recusada',
    message:
      'Solicitação recusada. Suas informações de contato não serão divulgadas',
    accent: BrandColors.primary.light,
    iconColor: BrandColors.neutral.white,
  },
} as const;

export function LawyerSolicitationDecisionCard({
  decision,
}: LawyerSolicitationDecisionCardProps) {
  const copy = DECISION_COPY[decision];

  return (
    <View style={styles.card} testID="decision-card">
      <View style={[styles.accent, { backgroundColor: copy.accent }]} />
      <View style={styles.content}>
        <Heading1 color={BrandColors.neutral.white}>{copy.title}</Heading1>
        <View style={styles.messageRow}>
          {decision === 'accepted' ? (
            <CheckIcon color={copy.iconColor} width={20} height={20} />
          ) : (
            <CloseCircleIcon color={copy.iconColor} size={20} />
          )}
          <Body1 color={BrandColors.neutral.white} style={styles.message}>
            {copy.message}
          </Body1>
        </View>
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
  },
  content: {
    flex: 1,
    gap: Spacing.xs,
    padding: Spacing.sm,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
  },
  message: {
    flex: 1,
  },
});
