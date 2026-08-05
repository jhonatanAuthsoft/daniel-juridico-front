import { BrandColors } from '@/constants/theme';

export type SolicitationStatus = 'emergencia' | 'urgente' | 'medio' | 'tenho_tempo';

export type SolicitationFooterVariant = 'accepted' | 'compatible';

/** Workflow status from `GET /solicitacoes` (`StatusSolicitacaoEnum`). */
export type SolicitationWorkflowStatus =
  | 'ABERTA'
  | 'AGUARDANDO_MATCHING'
  | 'MATCH_REALIZADO'
  | 'CANCELADA'
  | 'ENCERRADA';

export type ClientSolicitationCardData = {
  id: string;
  status: SolicitationStatus;
  workflowStatus: SolicitationWorkflowStatus;
  title: string;
  description: string;
  date: string;
  lawyerCount: number;
  footerVariant: SolicitationFooterVariant;
};

export const SOLICITATION_STATUS_META: Record<
  SolicitationStatus,
  { label: string; accentColor: string; labelColor: string }
> = {
  emergencia: {
    label: 'Emergência',
    accentColor: BrandColors.primary.light,
    labelColor: BrandColors.primary.light,
  },
  urgente: {
    label: 'Urgente',
    accentColor: BrandColors.primary.light,
    labelColor: BrandColors.primary.light,
  },
  medio: {
    label: 'Médio',
    accentColor: BrandColors.feedback.warning.medium,
    labelColor: BrandColors.neutral.xlight,
  },
  tenho_tempo: {
    label: 'Tenho tempo',
    accentColor: BrandColors.neutral.white,
    labelColor: BrandColors.neutral.white,
  },
};

export function formatSolicitationFooter(
  count: number,
  variant: SolicitationFooterVariant,
): { countLabel: string; rest: string } {
  if (variant === 'accepted') {
    return {
      countLabel: String(count),
      rest: ' advogados aceitaram sua solicitação',
    };
  }

  return {
    countLabel: String(count),
    rest: ' advogados compatíveis',
  };
}
