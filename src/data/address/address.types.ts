/** Raw ViaCEP response. */
export type ViaCepResponse = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
  erro?: boolean | string;
};

/** Domain model used by domain hooks / UI. */
export type AddressByCep = {
  cep: string;
  street: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
};
