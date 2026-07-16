export const addressKeys = {
  all: ['address'] as const,
  cep: (cep: string) => [...addressKeys.all, 'cep', cep] as const,
};
