export const addressKeys = {
  all: ['address'] as const,
  cep: (cep: string) => [...addressKeys.all, 'cep', cep] as const,
  citiesByUf: (uf: string) =>
    [...addressKeys.all, 'cities', uf.trim().toUpperCase()] as const,
};
