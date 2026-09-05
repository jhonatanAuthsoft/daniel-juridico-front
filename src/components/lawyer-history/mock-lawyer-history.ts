import type { SolicitationStatus } from '@/components/client-solicitation-card';

export type LawyerHistoryDecision = 'accepted' | 'rejected';

export type LawyerHistoryItem = {
  id: string;
  clientName: string;
  urgency: SolicitationStatus;
  description: string;
  decision: LawyerHistoryDecision;
  /** Opening date as dd/MM/yyyy. */
  dateLabel: string;
  /** Specialty name from the catalog (empty hides the row). */
  specialty: string;
};

export const MOCK_LAWYER_HISTORY: LawyerHistoryItem[] = [
  {
    id: 'hist-1',
    clientName: 'Luiza Sampaio',
    urgency: 'urgente',
    description:
      'Preciso de orientacao sobre rescisao de contrato de aluguel com clausula de multa a...',
    decision: 'accepted',
    dateLabel: '25/06/2026',
    specialty: 'Direito do Consumidor',
  },
  {
    id: 'hist-2',
    clientName: 'Maria Gomes',
    urgency: 'emergencia',
    description:
      'Preciso de orientacao sobre rescisao de contrato de aluguel com clausula de multa a...',
    decision: 'rejected',
    dateLabel: '25/06/2026',
    specialty: 'Direito do Consumidor',
  },
  {
    id: 'hist-3',
    clientName: 'Luiza Bittencourt',
    urgency: 'urgente',
    description:
      'Preciso de orientacao sobre rescisao de contrato de aluguel com clausula de multa a...',
    decision: 'accepted',
    dateLabel: '25/06/2026',
    specialty: 'Direito do Consumidor',
  },
  {
    id: 'hist-4',
    clientName: 'Pedro Alves',
    urgency: 'medio',
    description:
      'Preciso de orientacao sobre rescisao de contrato de aluguel com clausula de multa a...',
    decision: 'rejected',
    dateLabel: '25/06/2026',
    specialty: 'Direito do Consumidor',
  },
];
