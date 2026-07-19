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
};

export type LawyerSolicitationDetails = {
  id: string;
  title: string;
  urgency: string;
  practice: string;
  specialties: string[];
  location: string;
  billingMethod: string;
  description: string;
  client: LawyerClientProfile;
};

const DEFAULT_DESCRIPTION =
  'Preciso de orientação sobre rescisão de contrato de aluguel com cláusula de multa. O proprietário solicitou a desocupação antes do prazo e preciso entender meus direitos, os valores envolvidos e como formalizar a negociação.';

export const MOCK_LAWYER_SOLICITATION_DETAILS: LawyerSolicitationDetails[] =
  MOCK_LAWYER_SOLICITATIONS.map((solicitation, index) => ({
    id: solicitation.id,
    title: 'Rescisão de contrato de aluguel',
    urgency: solicitation.status,
    practice: 'Consultivo',
    specialties: ['Direito Civil', 'Direito Imobiliário'],
    location: solicitation.location,
    billingMethod: 'Honorários contratuais',
    description: DEFAULT_DESCRIPTION,
    client: {
      name: solicitation.clientName,
      location: solicitation.location.replace(' - ', ', '),
      pronouns: 'Ela/Dela',
      maritalStatus: index === 0 ? 'Solteiro(a)' : 'Não informado',
      profession: index === 0 ? 'Professora' : 'Profissional autônoma',
      monthlyIncome: index === 0 ? 'R$ 5.000,00' : 'R$ 4.000,00',
      phone: '(75) 98888-0502',
      email:
        index === 0
          ? 'luiza.sampaio@gmail.com'
          : `${solicitation.clientName.toLowerCase().replaceAll(' ', '.')}@gmail.com`,
    },
  }));
