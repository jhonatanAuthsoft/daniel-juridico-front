import {
  MOCK_CLIENT_SOLICITATIONS,
  SOLICITATION_STATUS_META,
  type SolicitationStatus,
} from '@/components/client-solicitation-card';
import type { ClientConnectionStatusValue } from '@/components/client-connection-status';

export type CompatibleLawyer = {
  id: string;
  name: string;
  honorific: string;
  initials: string;
  rating: string;
  availability: string;
  location: string;
  role: string;
  avatarColor: string;
  registration: string;
  biography: string;
  address: string;
  supplementalRegistration: string;
  education: string;
  yearsOfExperience: number;
  specialties: string[];
  subspecialties: string[];
  billingMethods: string[];
  connectionStatus: ClientConnectionStatusValue;
  phone: string;
  email: string;
};

export type ClientSolicitationDetails = {
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
  compatibleLawyers: CompatibleLawyer[];
};

export const MOCK_COMPATIBLE_LAWYERS: CompatibleLawyer[] = [
  {
    id: 'lawyer-1',
    name: 'Maria Gomes',
    honorific: 'Doutora/Dra.',
    initials: 'MG',
    rating: '5,0',
    availability: 'Disponível',
    location: 'Rio Branco - Salvador',
    role: 'Pautista',
    avatarColor: '#7A5C58',
    registration: 'OAB 155242/BA',
    biography:
      'Sou especialista em direito civil, com foco em contratos e responsabilidade civil. Atuo com ética e transparência, buscando sempre a melhor solução para meus clientes. Agende sua consulta!',
    address: 'Da Primavera, Cruz das Almas - BA',
    supplementalRegistration: '45871400/BA',
    education: 'Universidade Getúlio Vargas Silva',
    yearsOfExperience: 6,
    specialties: ['Direito Civil', 'Direito Penal', 'Direito da Família'],
    subspecialties: [
      'Contratos',
      'Responsabilidade Civil',
      'Cobrança e Execução',
    ],
    billingMethods: [
      'Honorários Contratuais',
      'honorários percentuais',
      'a combinar',
    ],
    connectionStatus: 'idle',
    phone: '(75) 98888-0502',
    email: 'maria.gomes@gmail.com',
  },
  {
    id: 'lawyer-2',
    name: 'Amanda Costa',
    honorific: 'Doutora/Dra.',
    initials: 'AC',
    rating: '4,8',
    availability: 'Disponível',
    location: 'Centro - Salvador',
    role: 'Advogado',
    avatarColor: '#8A6D5B',
    registration: 'OAB 204851/BA',
    biography:
      'Atuo na defesa dos interesses dos meus clientes com escuta atenta, clareza e soluções jurídicas personalizadas.',
    address: 'Centro, Salvador - BA',
    supplementalRegistration: 'OAB 89451/SE',
    education: 'Universidade Federal da Bahia',
    yearsOfExperience: 8,
    specialties: ['Direito Civil', 'Direito da Família'],
    subspecialties: ['Contratos', 'Mediação', 'Responsabilidade Civil'],
    billingMethods: ['Honorários Contratuais', 'a combinar'],
    connectionStatus: 'pending',
    phone: '(75) 98888-0502',
    email: 'amanda.costa@gmail.com',
  },
  {
    id: 'lawyer-3',
    name: 'Juliana Paes',
    honorific: 'Doutora/Dra.',
    initials: 'JP',
    rating: '4,0',
    availability: 'Disponível',
    location: 'Pelourinho - Salvador',
    role: 'Advogado',
    avatarColor: '#626B73',
    registration: 'OAB 178420/BA',
    biography:
      'Advogada com atuação prática e transparente, comprometida com orientação acessível e atendimento humanizado.',
    address: 'Pelourinho, Salvador - BA',
    supplementalRegistration: 'OAB 72419/PE',
    education: 'Universidade Católica do Salvador',
    yearsOfExperience: 5,
    specialties: ['Direito Civil', 'Direito Penal'],
    subspecialties: ['Cobrança e Execução', 'Contratos'],
    billingMethods: ['Honorários Contratuais', 'honorários percentuais'],
    connectionStatus: 'accepted',
    phone: '(75) 98888-0502',
    email: 'juliana.paes@gmail.com',
  },
  {
    id: 'lawyer-4',
    name: 'Clara Nunes',
    honorific: 'Doutora/Dra.',
    initials: 'CN',
    rating: '4,0',
    availability: 'Disponível',
    location: 'Pelourinho - Salvador',
    role: 'Advogado',
    avatarColor: '#8A3345',
    registration: 'OAB 192376/BA',
    biography:
      'Especialista em soluções preventivas e contenciosas, com comunicação direta e acompanhamento próximo de cada caso.',
    address: 'Pelourinho, Salvador - BA',
    supplementalRegistration: 'OAB 61287/SE',
    education: 'Universidade Salvador',
    yearsOfExperience: 7,
    specialties: ['Direito da Família', 'Direito Civil'],
    subspecialties: ['Mediação', 'Responsabilidade Civil'],
    billingMethods: ['Honorários Contratuais', 'a combinar'],
    connectionStatus: 'rejected',
    phone: '(75) 98888-0502',
    email: 'clara.nunes@gmail.com',
  },
];

export const MOCK_CLIENT_SOLICITATION_DETAILS: ClientSolicitationDetails[] =
  MOCK_CLIENT_SOLICITATIONS.map((solicitation) => ({
    id: solicitation.id,
    title: solicitation.title,
    status: solicitation.status,
    practice: 'Pautista',
    specialties: ['Direito Civil', 'Direito Penal', 'Direito da Família'],
    subspecialties: ['Contratos', 'Responsabilidade Civil', 'Cobrança e Execução'],
    minimumExperienceMonths: 6,
    location: 'Rio Branco - Salvador',
    billingMethod: 'A combinar',
    description: solicitation.description,
    compatibleLawyers: MOCK_COMPATIBLE_LAWYERS.slice(0, solicitation.lawyerCount),
  }));

export function getSolicitationStatusLabel(status: SolicitationStatus): string {
  return SOLICITATION_STATUS_META[status].label;
}
