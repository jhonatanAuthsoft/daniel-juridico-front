/** API wire enums / payloads keep server field names (pt-BR). */

export type DocumentTypeApi = 'CPF' | 'CNPJ';
export type PronounsApi = 'ELE' | 'ELA' | 'NEUTRO';

/** Wire body for `POST /clientes/cadastrar`. */
export type RegisterClientRequest = {
  nomeCompleto?: string;
  razaoSocial?: string;
  areaAtuacao?: string;
  email: string;
  senha: string;
  profissao?: string;
  tipoDocumento: DocumentTypeApi;
  numeroDocumento: string;
  rg?: string;
  rgOrgaoEmissor?: string;
  rgUf?: string;
  dataNascimento?: string;
  pronomes: PronounsApi;
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

/** Wire user node inside the register-client response. */
export type RegisterClientUserWire = {
  id: string;
  nomeCompleto: string;
  email: string;
  status: string;
  perfil: string;
  telefone: string;
  termosAceitos: boolean;
};

/** Wire response for `POST /clientes/cadastrar`. */
export type RegisterClientWireResponse = {
  usuario: RegisterClientUserWire;
  cliente: Record<string, unknown>;
  endereco: Record<string, unknown>;
  token: string;
  refreshToken: string;
};

/** Domain-friendly view of the register-client response. */
export type RegisterClientResult = {
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
  raw: RegisterClientWireResponse;
};

/** App params for `PATCH /clientes/me/dados-gerais`. */
export type UpdateClientGeneralDataParams = {
  fullName: string;
};

/** Wire body for `PATCH /clientes/me/dados-gerais`. */
export type UpdateClientGeneralDataWireRequest = {
  nomeCompleto: string;
};

/** App params for `PATCH /clientes/me/endereco`. */
export type UpdateClientAddressParams = {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
};

/** Wire body for `PATCH /clientes/me/endereco`. */
export type UpdateClientAddressWireRequest = {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
};

/** App params for `PATCH /clientes/me/perfil-pessoal`. */
export type UpdateClientPersonalProfileParams = {
  documentType: 'cpf' | 'cnpj';
  pronouns: string;
  profession: string;
  maritalStatus: string;
  monthlyIncome: string;
};

/** Wire body for `PATCH /clientes/me/perfil-pessoal`. */
export type UpdateClientPersonalProfileWireRequest = {
  pronomes: PronounsApi;
  profissao?: string;
  areaAtuacao?: string;
  estadoCivil: string;
  faixaRenda: string;
};
