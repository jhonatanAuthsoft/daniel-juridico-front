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
  fotoUrl?: string | null;
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
