import type { SolicitationStatus } from '@/components/client-solicitation-card';

export type LawyerSolicitationCardData = {
  id: string;
  clientName: string;
  status: SolicitationStatus;
  description: string;
  /** Relative time ("2h atrás") or absolute date ("25/06/2026"). */
  timeLabel: string;
  /** Prefer clock icon when relative. */
  timeKind: 'relative' | 'absolute';
  location: string;
};

export const MOCK_LAWYER_SOLICITATIONS: LawyerSolicitationCardData[] = [
  {
    id: 'law-sol-1',
    clientName: 'Luiza Sampaio',
    status: 'urgente',
    description:
      'Preciso de orientacao sobre rescisao de contrato de aluguel com clausula de multa a...',
    timeLabel: '2h atrás',
    timeKind: 'relative',
    location: 'Salvador - Bahia',
  },
  {
    id: 'law-sol-2',
    clientName: 'Maria Gomes',
    status: 'emergencia',
    description:
      'Preciso de orientacao sobre rescisao de contrato de aluguel com clausula de multa a...',
    timeLabel: '2h atrás',
    timeKind: 'relative',
    location: 'Salvador - Bahia',
  },
  {
    id: 'law-sol-3',
    clientName: 'Luiza Bittencourt',
    status: 'medio',
    description:
      'Preciso de orientacao sobre rescisao de contrato de aluguel com clausula de multa a...',
    timeLabel: '25/06/2026',
    timeKind: 'absolute',
    location: 'São Paulo - SP',
  },
  {
    id: 'law-sol-4',
    clientName: 'Luiza Bittencourt',
    status: 'tenho_tempo',
    description:
      'Preciso de orientacao sobre rescisao de contrato de aluguel com clausula de multa a...',
    timeLabel: '25/06/2026',
    timeKind: 'absolute',
    location: 'São Paulo - SP',
  },
  {
    id: 'law-sol-5',
    clientName: 'Luiza Bittencourt',
    status: 'tenho_tempo',
    description:
      'Preciso de orientacao sobre rescisao de contrato de aluguel com clausula de multa a...',
    timeLabel: '25/06/2026',
    timeKind: 'absolute',
    location: 'São Paulo - SP',
  },
];
