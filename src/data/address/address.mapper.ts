import type { AddressByCep, ViaCepResponse } from './address.types';

export function mapViaCepToAddress(response: ViaCepResponse): AddressByCep {
  return {
    cep: response.cep?.replace(/\D/g, '') ?? '',
    street: response.logradouro ?? '',
    complement: response.complemento ?? '',
    neighborhood: response.bairro ?? '',
    city: response.localidade ?? '',
    state: response.uf ?? '',
  };
}
