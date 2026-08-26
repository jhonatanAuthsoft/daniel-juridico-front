/** API wire enums / payloads keep server field names (pt-BR). */

export type TreatmentPronounApi = 'DOUTOR' | 'DOUTORA' | 'NEUTRO';

/** Wire node for an OAB record (`OabInputDTO`). */
export type OabWireRequest = {
  numero: string;
  uf: string;
  dataExpedicao: string;
  /** S3 object keys (N photos per OAB card). */
  fotosUrls?: string[] | null;
};

export type PracticeAreaWireRequest = {
  estado: string;
  cidade: string;
};

export type SpecialtyWireRequest = {
  especialidadeCodigo?: string;
  especialidadeLivre?: string;
  subespecialidadeCodigo?: string;
  subespecialidadeLivre?: string;
};

export type PostgraduateWireRequest = {
  nomeCurso: string;
  instituicao: string;
  anoFormacao?: number;
};

/** Wire body for `POST /advogados/cadastrar`. */
export type RegisterLawyerRequest = {
  nomeCompleto: string;
  nomeSocial?: string;
  email: string;
  senha: string;
  rg: string;
  rgOrgaoEmissor: string;
  rgUf: string;
  cpf: string;
  nomePai?: string;
  nomeMae: string;
  pronomeTratamento: TreatmentPronounApi;
  telefone: string;
  /** S3 object key (`ADVOGADO_PERFIL`). Required on signup. */
  fotoUrl: string;
  universidade: string;
  curso: string;
  anoFormacao?: number;
  atuacaoDesde?: string;
  biografia?: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  oabPrincipal: OabWireRequest;
  oabsSuplementares?: OabWireRequest[];
  areasAtuacao: PracticeAreaWireRequest[];
  modalidades: string[];
  especialidades?: SpecialtyWireRequest[];
  formasCobranca: string[];
  posGraduacoes?: PostgraduateWireRequest[];
};

/** Wire user node inside the register-lawyer response. */
export type RegisterLawyerUserWire = {
  id: string;
  nomeCompleto: string;
  email: string;
  status: string;
  perfil: string;
  telefone: string;
  termosAceitos: boolean;
};

/** Wire response for `POST /advogados/cadastrar`. */
export type RegisterLawyerWireResponse = {
  usuario: RegisterLawyerUserWire;
  advogado: Record<string, unknown>;
  endereco: Record<string, unknown>;
  oabs: Record<string, unknown>[];
  areasAtuacao: Record<string, unknown>[];
  modalidades: Record<string, unknown>[];
  especialidades: Record<string, unknown>[];
  formasCobranca: Record<string, unknown>[];
  posGraduacoes: Record<string, unknown>[];
  token: string;
  refreshToken: string;
};

/** Domain-friendly view of the register-lawyer response. */
export type RegisterLawyerResult = {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    profile: string;
    phone: string;
    termsAccepted: boolean;
  };
  raw: RegisterLawyerWireResponse;
};

/** App params for `PATCH /advogados/me/dados-gerais`. */
export type UpdateLawyerGeneralDataParams = {
  fullName: string;
};

/** Wire body for `PATCH /advogados/me/dados-gerais`. */
export type UpdateLawyerGeneralDataWireRequest = {
  nomeCompleto: string;
};

/** App params for `PATCH /advogados/me/endereco`. */
export type UpdateLawyerAddressParams = {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
};

/** Wire body for `PATCH /advogados/me/endereco`. */
export type UpdateLawyerAddressWireRequest = {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
};

/** App params for `PATCH /advogados/me/formas-cobranca`. */
export type UpdateLawyerBillingParams = {
  billingMethods: string[];
};

/** Wire body for `PATCH /advogados/me/formas-cobranca`. */
export type UpdateLawyerBillingWireRequest = {
  formasCobranca: string[];
};

/** App params for `PATCH /advogados/me/biografia`. */
export type UpdateLawyerBiographyParams = {
  pronouns: string;
  biography: string;
};

/** Wire body for `PATCH /advogados/me/biografia`. */
export type UpdateLawyerBiographyWireRequest = {
  pronomeTratamento: TreatmentPronounApi;
  biografia?: string | null;
};

/** App params for a single OAB on `PATCH /advogados/me/documentacao`. */
export type UpdateLawyerOabParams = {
  number: string;
  uf: string;
  issueDate: string;
  photoKeys: string[];
};

/** App params for `PATCH /advogados/me/documentacao`. */
export type UpdateLawyerDocumentationParams = {
  oabNumber: string;
  oabUf: string;
  oabIssueDate: string;
  oabPhotoKeys: string[];
  supplementalOabs: UpdateLawyerOabParams[];
};

/** Wire body for `PATCH /advogados/me/documentacao`. */
export type UpdateLawyerDocumentationWireRequest = {
  oabPrincipal: OabWireRequest;
  oabsSuplementares?: OabWireRequest[];
};

/** App params for `PATCH /advogados/me/graduacao`. */
export type UpdateLawyerGraduationParams = {
  university: string;
  course: string;
  graduationYear: string;
};

/** Wire body for `PATCH /advogados/me/graduacao`. */
export type UpdateLawyerGraduationWireRequest = {
  universidade: string;
  curso: string;
  anoFormacao: number;
};
