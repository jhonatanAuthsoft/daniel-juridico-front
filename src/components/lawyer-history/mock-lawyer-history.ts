import type { SolicitationStatus } from '@/components/client-solicitation-card';

export type LawyerHistoryDecision = 'accepted' | 'rejected';

export type LawyerHistoryItem = {
  id: string;
  clientName: string;
  urgency: SolicitationStatus;
  description: string;
  decision: LawyerHistoryDecision;
};

export const MOCK_LAWYER_HISTORY: LawyerHistoryItem[] = [
  {
    id: 'hist-1',
    clientName: 'Luiza Sampaio',
    urgency: 'urgente',
    description:
      'Preciso de orientacao sobre rescisao de contrato de aluguel com clausula de multa a...',
    decision: 'accepted',
  },
  {
    id: 'hist-2',
    clientName: 'Maria Gomes',
    urgency: 'emergencia',
    description:
      'Preciso de orientacao sobre rescisao de contrato de aluguel com clausula de multa a...',
    decision: 'rejected',
  },
  {
    id: 'hist-3',
    clientName: 'Luiza Bittencourt',
    urgency: 'urgente',
    description:
      'Preciso de orientacao sobre rescisao de contrato de aluguel com clausula de multa a...',
    decision: 'accepted',
  },
  {
    id: 'hist-4',
    clientName: 'Pedro Alves',
    urgency: 'medio',
    description:
      'Preciso de orientacao sobre rescisao de contrato de aluguel com clausula de multa a...',
    decision: 'rejected',
  },
];
