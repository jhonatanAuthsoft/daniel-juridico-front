/** Wire / domain types for `GET /usuarios/me`. */

export type MePerfilWire = {
  fotoUrl?: string | null;
  nomeCompleto?: string | null;
  razaoSocial?: string | null;
  areaAtuacao?: string | null;
  profissao?: string | null;
  tipoDocumento?: string | null;
  numeroDocumento?: string | null;
  rg?: string | null;
  pronomes?: string | null;
  faixaRenda?: string | null;
  estadoCivil?: string | null;
  pronomeTratamento?: string | null;
  biografia?: string | null;
  disponibilidade?: string | null;
  universidade?: string | null;
  curso?: string | null;
  anoFormacao?: number | string | null;
};

export type MeEnderecoWire = {
  cep?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
};

export type MeOabWire = {
  numero?: string | null;
  uf?: string | null;
  principal?: boolean | null;
  dataExpedicao?: string | null;
  fotosUrls?: (string | null)[] | null;
};

export type MeCatalogItemWire = {
  codigo?: string | null;
  nome?: string | null;
};

export type MeDetalheWire = {
  perfil?: MePerfilWire | null;
  endereco?: MeEnderecoWire | null;
  oabs?: MeOabWire[] | null;
  formasCobranca?: MeCatalogItemWire[] | null;
};

export type MeWireResponse = {
  usuario: {
    id: string;
    email: string;
    nomeCompleto: string;
    perfil: string;
    notificacoesPushHabilitadas?: boolean | null;
  };
  cliente?: MeDetalheWire | null;
  advogado?: MeDetalheWire | null;
};

export type ClientDocumentType = 'cpf' | 'cnpj';

/** Client cadastral fields ready for the edit-data screens. */
export type ClientEditProfile = {
  fullName: string;
  email: string;
  documentType: ClientDocumentType;
  documentNumber: string;
  rg: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
  pronouns: string;
  profession: string;
  maritalStatus: string;
  monthlyIncome: string;
};

export type LawyerEditOabEntry = {
  number: string;
  uf: string;
  issueDate: string;
  photoUris: string[];
  photoKeys: string[];
};

/** Lawyer cadastral fields ready for the edit-data screens. */
export type LawyerEditProfile = {
  fullName: string;
  email: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
  billingMethods: string[];
  biography: string;
  pronouns: string;
  oabNumber: string;
  oabUf: string;
  oabIssueDate: string;
  oabPhotoUris: string[];
  oabPhotoKeys: string[];
  supplementalOabs: LawyerEditOabEntry[];
  university: string;
  course: string;
  graduationYear: string;
};

export type MeResult = {
  /** S3 object key for the profile photo (`fotoUrl`), or null when unset. */
  photoKey: string | null;
  /** Push preference from `usuarios.notificacoes_push_habilitadas`. */
  pushNotificationsEnabled: boolean;
  /** Lawyer profile marked unavailable (`advogados.disponibilidade = INDISPONIVEL`). */
  profileUnavailable: boolean;
  /** Present for clients; null for lawyers. */
  clientProfile: ClientEditProfile | null;
  /** Present for lawyers; null for clients. */
  lawyerProfile: LawyerEditProfile | null;
};
