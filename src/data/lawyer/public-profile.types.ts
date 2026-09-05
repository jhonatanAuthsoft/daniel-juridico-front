/** Wire / domain types for `GET /advogados/{id}` (perfil público — CLIENTE). */

export type CatalogItemWire = {
  codigo: string;
  nome: string;
};

export type PublicLawyerAddressWire = {
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
};

export type PublicLawyerOabWire = {
  numero: string;
  uf: string;
  principal: boolean;
};

export type PublicLawyerAreaWire = {
  id: string;
  estado: string;
  cidade: string;
};

export type PublicLawyerPostgraduateWire = {
  nomeCurso?: string | null;
  instituicao?: string | null;
  anoFormacao?: number | null;
};

export type PublicLawyerProfileWire = {
  id: string;
  nome: string;
  nomeCompleto?: string | null;
  nomeSocial?: string | null;
  pronomeTratamento?: string | null;
  fotoUrl?: string | null;
  biografia?: string | null;
  disponibilidade?: string | null;
  mediaAvaliacoes?: number | null;
  totalAvaliacoes?: number | null;
  universidade?: string | null;
  curso?: string | null;
  anoFormacao?: number | null;
  atuacaoDesde?: string | null;
  anosExperiencia?: number | null;
  endereco?: PublicLawyerAddressWire | null;
  oabPrincipal?: PublicLawyerOabWire | null;
  oabsSuplementares?: PublicLawyerOabWire[] | null;
  modalidades?: CatalogItemWire[] | null;
  especialidades?: CatalogItemWire[] | null;
  subespecialidades?: CatalogItemWire[] | null;
  formasCobranca?: CatalogItemWire[] | null;
  areasAtuacao?: PublicLawyerAreaWire[] | null;
  posGraduacoes?: PublicLawyerPostgraduateWire[] | null;
};

export type PublicLawyerCatalogItem = {
  code: string;
  name: string;
};

export type PublicLawyerOab = {
  number: string;
  uf: string;
  isPrimary: boolean;
};

export type PublicLawyerProfile = {
  id: string;
  name: string;
  fullName: string;
  socialName: string | null;
  honorific: string;
  photoKey: string | null;
  biography: string;
  availability: string | null;
  isAvailable: boolean;
  averageRating: number | null;
  totalReviews: number;
  university: string;
  course: string;
  graduationYear: number | null;
  practiceSince: string | null;
  yearsOfExperience: number;
  addressLabel: string;
  primaryOab: PublicLawyerOab | null;
  supplementalOabs: PublicLawyerOab[];
  modalities: PublicLawyerCatalogItem[];
  specialties: PublicLawyerCatalogItem[];
  subspecialties: PublicLawyerCatalogItem[];
  billingMethods: PublicLawyerCatalogItem[];
  serviceAreas: { state: string; city: string }[];
};
