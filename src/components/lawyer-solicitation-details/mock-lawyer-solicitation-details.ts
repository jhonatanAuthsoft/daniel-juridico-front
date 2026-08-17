import type { SolicitationStatus } from '@/components/client-solicitation-card';
import { MOCK_LAWYER_HISTORY } from '@/components/lawyer-history/mock-lawyer-history';
import { MOCK_LAWYER_SOLICITATIONS } from '@/components/lawyer-solicitation-card';

export type LawyerClientProfile = {
  name: string;
  location: string;
  pronouns: string;
  maritalStatus: string;
  profession: string;
  monthlyIncome: string;
  phone: string;
  email: string;
  /** S3 object key for the client profile photo, when available. */
  photoKey?: string | null;
};

export type LawyerSolicitationDecision = 'accepted' | 'rejected';

export type LawyerClientReview = {
  rating: number;
  comment: string;
};

export type LawyerSolicitationDetails = {
  id: string;
  title: string;
  status: SolicitationStatus;
  practice: string;
  specialties: string[];
  subspecialties: string[];
  minimumExperienceMonths: number;
  location: string;
  billingMethod: string;
  description: string;
  client: LawyerClientProfile;
  /** Present when the lawyer already accepted or rejected (Histórico). */
  decision?: LawyerSolicitationDecision;
  /** Review left by this client about this lawyer, when available. */
  clientReview?: LawyerClientReview | null;
};

const DEFAULT_DESCRIPTION =
  'Preciso de orientação sobre rescisão de contrato de aluguel com cláusula de multa. O proprietário solicitou a desocupação antes do prazo e preciso entender meus direitos, os valores envolvidos e como formalizar a negociação.';

function buildClient(
  clientName: string,
  location: string,
  index: number,
): LawyerClientProfile {
  return {
    name: clientName,
    location: location.replace(' - ', ', '),
    pronouns: 'Ela/Dela',
    maritalStatus: index === 0 ? 'Solteiro(a)' : 'Não informado',
    profession: index === 0 ? 'Professora' : 'Profissional autônoma',
    monthlyIncome: index === 0 ? 'R$ 5.000,00' : 'R$ 4.000,00',
    phone: '(75) 98888-0502',
    email:
      index === 0
        ? 'luiza.sampaio@gmail.com'
        : `${clientName.toLowerCase().replaceAll(' ', '.')}@gmail.com`,
  };
}

const PENDING_DETAILS: LawyerSolicitationDetails[] =
  MOCK_LAWYER_SOLICITATIONS.map((solicitation, index) => ({
    id: solicitation.id,
    title: 'Rescisão de contrato de aluguel',
    status: solicitation.status,
    practice: 'Consultoria',
    specialties: ['Direito Civil'],
    subspecialties: ['Direito Imobiliário'],
    minimumExperienceMonths: 6,
    location: solicitation.location,
    billingMethod: 'Honorários contratuais',
    description: DEFAULT_DESCRIPTION,
    client: buildClient(solicitation.clientName, solicitation.location, index),
  }));

const HISTORY_DETAILS: LawyerSolicitationDetails[] = MOCK_LAWYER_HISTORY.map(
  (item, index) => ({
    id: item.id,
    title: 'Rescisão de contrato de aluguel',
    status: item.urgency,
    practice: 'Consultoria',
    specialties: ['Direito Civil'],
    subspecialties: ['Direito Imobiliário'],
    minimumExperienceMonths: 6,
    location: 'Salvador - Bahia',
    billingMethod: 'Honorários contratuais',
    description: DEFAULT_DESCRIPTION,
    decision: item.decision,
    client: buildClient(item.clientName, 'Salvador - Bahia', index),
    clientReview:
      index === 0
        ? {
            rating: 4,
            comment:
              'Profissional excepcional, muito feliz em ser atendida por ela',
          }
        : null,
  }),
);

export const MOCK_LAWYER_SOLICITATION_DETAILS: LawyerSolicitationDetails[] = [
  ...PENDING_DETAILS,
  ...HISTORY_DETAILS,
];
