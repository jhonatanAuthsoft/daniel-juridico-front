export type ApiErrorItem = {
  code?: string;
  field?: string;
  detail?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  timestamp?: string;
  message?: string;
  data: T;
  errors?: ApiErrorItem[];
};

export type TipoDocumentoApi = 'CPF' | 'CNPJ';
export type PronomesApi = 'ELE' | 'ELA' | 'NEUTRO';

export type CadastrarClienteRequest = {
  nomeCompleto?: string;
  razaoSocial?: string;
  areaAtuacao?: string;
  email: string;
  senha: string;
  profissao?: string;
  tipoDocumento: TipoDocumentoApi;
  numeroDocumento: string;
  rg?: string;
  dataNascimento?: string;
  pronomes: PronomesApi;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  fotoUrl?: string | null;
  faixaRenda?: string | null;
  estadoCivil?: string | null;
};

export type CadastrarClienteUsuarioResponse = {
  id: string;
  nomeCompleto: string;
  email: string;
  status: string;
  perfil: string;
  telefone: string;
  termosAceitos: boolean;
  termosAceitosEm?: string | null;
  termosVersao?: string | null;
};

export type CadastrarClienteResponse = {
  usuario: CadastrarClienteUsuarioResponse;
  cliente: Record<string, unknown>;
  endereco: Record<string, unknown>;
  token: string;
};
