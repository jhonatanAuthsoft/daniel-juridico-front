export type ClientPersonType = 'cpf' | 'cnpj';

export type ClientSignupFormValues = {
  email: string;
  phone: string;
  password: string;
  personType: ClientPersonType;
  fullName: string;
  rg: string;
  issuingAuthority: string;
  uf: string;
  cpf: string;
  cnpj: string;
  /** Required for CNPJ (maps to API `areaAtuacao`). */
  businessArea: string;
  birthDate: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
  maritalStatus: string;
  profession: string;
  monthlyIncome: string;
  pronouns: string;
  profileImageUri: string;
  /** S3 object key from POST /arquivos/url-upload (CLIENTE_PERFIL). */
  profileImageKey: string;
};
